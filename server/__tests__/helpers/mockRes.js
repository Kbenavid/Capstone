module.exports.makeRes = function makeRes() {
    const res = {};
    res.statusCode = 200;
    res.headers = {};
    res.status = jest.fn((code) => { res.statusCode = code; return res; });
    res.set = jest.fn((k, v) => { res.headers[k.toLowerCase()] = v; return res; });
    res.json = jest.fn((body) => { res._json = body; return res; });
    res.cookie = jest.fn(() => res);
    res.clearCookie = jest.fn(() => res);
    res.end = jest.fn(() => res);
    return res;
    };