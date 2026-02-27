const request = require('supertest');
const app = require('../server'); // path to your Express app
const mongoose = require('mongoose');
const Comment = require('../models/commentModel');

describe('Comment Routes', () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Comment.deleteMany(); // clean DB between tests
  });

  test('POST /create should add a comment', async () => {
    const res = await request(app)
      .post('/comments/create')
      .send({
        content: 'Test comment',
        userId: '123',
        username: 'tester',
        filmId: 'film1'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.comment.content).toBe('Test comment');

    const count = await Comment.countDocuments();
    expect(count).toBe(1);
  });

  test('GET /:filmId should return comments', async () => {
  await Comment.create({
    content: 'Hello',
    userId: '123',
    username: 'tester',
    filmId: 'film1'
  });

  const res = await request(app).get('/comments/film1');

  expect(res.statusCode).toBe(200);
  expect(res.body.length).toBe(1);
  expect(res.body[0].content).toBe('Hello');
});

});