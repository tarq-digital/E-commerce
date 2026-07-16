const request = require('supertest');
const app = require('../../src/app');

// Mock AuthService since the Database is globally mocked
jest.mock('../../src/services/auth.service', () => ({
  register: jest.fn((data) => {
    if (data.email === 'duplicate@weebster.in') {
      const ApiError = require('../../src/utils/api-error');
      throw new ApiError(409, 'Email already in use', 'EMAIL_EXISTS');
    }
    return Promise.resolve({ email: data.email });
  }),
  login: jest.fn((email, password) => {
    if (password === 'WrongPassword@123') {
      const ApiError = require('../../src/utils/api-error');
      throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }
    return Promise.resolve({
      user: { email },
      accessToken: 'mock-access-token',
      plainRefreshToken: 'mock-refresh-token',
    });
  }),
}));

describe('Authentication API', () => {
  const testUser = {
    first_name: 'Test',
    last_name: 'User',
    email: `testuser_${Date.now()}@weebster.in`,
    password: 'Password@123',
  };

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data.user.email).toEqual(testUser.email);
  });

  it('should fail registration with duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...testUser, email: 'duplicate@weebster.in' });

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
    expect(res.body.data.accessToken).toEqual('mock-access-token');

    const cookies = res.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some(c => c.includes('access_token='))).toBeTruthy();
  });
});
