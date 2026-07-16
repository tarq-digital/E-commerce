const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../src/database/connection');

// Placeholder for auth integration tests.
// Note: Running these tests requires the database to be seeded and running.

describe('Authentication API', () => {
  let server;
  const testUser = {
    first_name: 'Test',
    last_name: 'User',
    email: `testuser_${Date.now()}@weebster.in`,
    password: 'Password@123',
  };

  beforeAll((done) => {
    server = app.listen(8001, done);
  });

  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email = ?', [testUser.email]);
    await pool.end();
    server.close();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.user.email).toEqual(testUser.email);
    // Password hash should not be returned
    expect(res.body.data.user.password_hash).toBeUndefined();
  });

  it('should fail registration with duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(409);
    expect(res.body.success).toBeFalsy();
    expect(res.body.error_code).toEqual('EMAIL_EXISTS');
  });

  it('should fail login with incorrect password', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword@123',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBeFalsy();
    expect(res.body.error_code).toEqual('INVALID_CREDENTIALS');
  });

  it('should login successfully and set HttpOnly cookies', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.accessToken).toBeDefined();

    // Verify cookies are set
    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some(c => c.includes('access_token='))).toBeTruthy();
    expect(cookies.some(c => c.includes('refresh_token='))).toBeTruthy();
    expect(cookies.some(c => c.includes('HttpOnly'))).toBeTruthy();
  });
});
