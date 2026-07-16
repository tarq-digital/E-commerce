const request = require('supertest');
const app = require('../../src/app');
const { generateAccessToken } = require('../../src/utils/jwt');

// Mock auth middlewares to bypass real DB session/role checks in tests
jest.mock('../../src/middlewares/auth.middleware', () => {
  return {
    requireAuth: (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.includes('mock-admin')) {
        req.user = { id: 1, role_id: 1, sessionId: 999 };
      } else if (authHeader && authHeader.includes('mock-customer')) {
        req.user = { id: 2, role_id: 2, sessionId: 998 };
      } else {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      next();
    },
    requireRole: (role) => (req, res, next) => {
      // Admin has role_id = 1
      if (role === 'ADMIN' && req.user.role_id !== 1) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      next();
    },
    requirePermission: () => (req, res, next) => next(),
  };
});

// Mock CategoryService
jest.mock('../../src/modules/catalog/services/category.service', () => ({
  createCategory: jest.fn().mockResolvedValue({ slug: 'test-category' }),
  getCategories: jest.fn().mockResolvedValue({
    data: [],
    meta: { limit: 5 }
  })
}));

describe('Admin Catalog API', () => {
  let adminToken = 'mock-admin-token';
  let customerToken = 'mock-customer-token';

  describe('Category Management', () => {
    it('should reject access to customers', async () => {
      const res = await request(app)
        .post('/api/v1/admin/categories')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ name: 'Test Category' });

      expect(res.statusCode).toEqual(403);
    });

    it('should allow admin to create a category', async () => {
      const res = await request(app)
        .post('/api/v1/admin/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Test Category', slug: 'test-category' });

      expect(res.statusCode).toEqual(201);
      expect(res.body.data.slug).toEqual('test-category');
    });

    it('should fetch categories with pagination', async () => {
      const res = await request(app)
        .get('/api/v1/admin/categories?limit=5&page=1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.limit).toEqual(5);
    });
  });
});
