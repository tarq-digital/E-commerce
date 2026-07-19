// Mock MySQL to prevent production database connections during tests
jest.mock('mysql2/promise', () => ({
  createPool: jest.fn(() => ({
    getConnection: jest.fn().mockResolvedValue({
      release: jest.fn(),
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      query: jest.fn().mockResolvedValue([[], []]),
    }),
    query: jest.fn().mockResolvedValue([[], []]),
    end: jest.fn(),
  })),
}));

// Mock Resend
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => {
      return {
        emails: {
          send: jest.fn().mockResolvedValue({ id: 'mock-id' }),
        },
      };
    }),
  };
});

// Mock Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn((options, cb) => {
        cb(null, { secure_url: 'http://mock.url', public_id: 'mock_id' });
        return { end: jest.fn() };
      }),
    },
  },
}));

// Set environment variables for testing
process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
