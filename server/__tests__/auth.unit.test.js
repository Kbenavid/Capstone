// server/__tests__/auth.unit.test.js

// Mocks
jest.mock('../models/User', () => {
    // Mock Mongoose model: constructor + static .findOne
    const UserModelMock = jest.fn(function UserDoc(doc) {
      Object.assign(this, doc);
      this.save = jest.fn().mockResolvedValue(this);
      this.setPassword = jest.fn().mockResolvedValue();
    });
    UserModelMock.findOne = jest.fn(); // static
    return UserModelMock;
  });
  
  jest.mock('jsonwebtoken', () => ({
    sign:   jest.fn(() => 'mock.jwt'),
    verify: jest.fn(() => ({ userId: 'u1', username: 'alice' })),
  }));
  
  // (Not strictly needed if your controller uses setPassword, but harmless)
  jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('hash'),
  }));
  
  // Imports
  const User = require('../models/User');
  const jwt  = require('jsonwebtoken');
  const { makeRes } = require('./helpers/mockRes');
  const { register, login, logout, me } = require('../controllers/authController');
  
  // Helpers
  const req = (body = {}, cookies = {}) => ({ body, cookies });
  
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });
  
  // ─────────────────────────────────────────────────────────────
  // REGISTER
  // ─────────────────────────────────────────────────────────────
  test('register -> 201 creates user and sets password', async () => {
    User.findOne.mockResolvedValue(null); // no duplicate
  
    const res = makeRes();
    await register(req({ username: 'alice', password: 'pass', email: 'a@b.com' }), res);
  
    expect(User.findOne).toHaveBeenCalled();
    // the constructor was called once with normalized data
    expect(User).toHaveBeenCalledWith({ username: 'alice', email: 'a@b.com' });
  
    const instance = User.mock.instances[0];
    expect(instance.setPassword).toHaveBeenCalledWith('pass');
    expect(instance.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Registered' });
  });
  
  test('register duplicate -> 409', async () => {
    User.findOne.mockResolvedValue({ _id: 'u-existing' });
  
    const res = makeRes();
    await register(req({ username: 'alice', password: 'pass' }), res);
  
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'user already exists' });
  });
  
  test('register missing fields -> 400', async () => {
    const res = makeRes();
    await register(req({ username: '' }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
  
  // ─────────────────────────────────────────────────────────────
  // LOGIN / LOGOUT
  // ─────────────────────────────────────────────────────────────
  test('login success -> sets httpOnly cookie and returns 200', async () => {
    const user = { _id: 'u1', username: 'alice', validatePassword: jest.fn().mockResolvedValue(true) };
    User.findOne.mockResolvedValue(user);
  
    const res = makeRes();
    await login(req({ username: 'alice', password: 'pass' }), res);
  
    expect(User.findOne).toHaveBeenCalledWith({ username: 'alice' });
    expect(jwt.sign).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith('token', 'mock.jwt', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ message: 'Logged in' });
  });
  
  test('login invalid -> 400', async () => {
    User.findOne.mockResolvedValue(null);
  
    const res = makeRes();
    await login(req({ username: 'nope', password: 'x' }), res);
  
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });
  
  test('logout -> clears cookie', async () => {
    const res = makeRes();
    await logout(req(), res);
  
    expect(res.clearCookie).toHaveBeenCalledWith('token', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({ message: 'Logged out' });
  });
  
  // ─────────────────────────────────────────────────────────────
  // ME
  // ─────────────────────────────────────────────────────────────
  test('me valid cookie -> 200 returns payload', async () => {
    const res = makeRes();
    await me(req({}, { token: 'mock.jwt' }), res);
  
    expect(jwt.verify).toHaveBeenCalledWith('mock.jwt', 'test-secret');
    expect(res.json).toHaveBeenCalledWith({ userId: 'u1', username: 'alice' });
  });
  
  test('me missing cookie -> 401', async () => {
    const res = makeRes();
    await me(req({}, {}), res);
  
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });
  
  test('me invalid token -> 401', async () => {
    jwt.verify.mockImplementationOnce(() => { throw new Error('bad token'); });
  
    const res = makeRes();
    await me(req({}, { token: 'bad.jwt' }), res);
  
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
  });
  