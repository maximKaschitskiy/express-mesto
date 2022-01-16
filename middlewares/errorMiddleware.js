const errorMiddleware = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Ошибка сервера';
  res.status(status).send({ message });
  next();
};

module.exports = errorMiddleware;
