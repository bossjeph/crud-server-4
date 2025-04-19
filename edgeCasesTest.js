const request = require('supertest');
const app = require('../server');

describe('Edge Case Tests', () => {
  it('should reject request with no auth token', async () => {
    const res = await request(app).post('/items').send({ name: 'Test' });
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('Unauthorized access');
  });

  it('should reject request with missing name', async () => {
    const res = await request(app)
      .post('/items')
      .set('Authorization', 'Bearer valid-token')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Name is required');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.statusCode).toBe(404);
  });
});
