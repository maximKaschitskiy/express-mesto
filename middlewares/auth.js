const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { Unauthorized } = require('../errors/unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  let token = null;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Неверный токен'));
  } else {
    token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
      next(new Unauthorized('Неавторизовано'));
    }
    req.user = payload;
    next();
  }
};

module.exports = auth;
