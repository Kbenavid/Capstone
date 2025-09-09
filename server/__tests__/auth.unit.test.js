jest.mock('../models/User', () => ({ findOne: jest.fn() }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn(() => 'mock.jwt') }));


const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { makeRes } = require('./helpers/mockRes');
const { login, logout } = require('../controllers/authController');


beforeEach(() => { jest.clearAllMocks(); process.env.JWT_SECRET = 'test'; });


const req = (body) => ({ body });


test('login success', async () => {
const user = { _id: 'u1', username: 'alice', validatePassword: jest.fn().mockResolvedValue(true) };
User.findOne.mockResolvedValue(user);
const res = makeRes();
await login(req({ username: 'alice', password: 'x' }), res);
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
});


test('logout clears cookie', async () => {
const res = makeRes();
await logout(req({}), res);
expect(res.clearCookie).toHaveBeenCalledWith('token', expect.any(Object));
expect(res.json).toHaveBeenCalledWith({ message: 'Logged out' });
});