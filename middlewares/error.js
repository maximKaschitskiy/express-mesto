const error = (err, req, res, next) => {
  switch (err.name) {
    case 'CastError':
      return res.status(400).send({message: 'Невалидный id'});
    case 'ValidationError':
      return res.status(400).send({message: 'Переданы некорректные данные'});
    case 'MongoServerError':
      return res.status(409).send({message: 'Пользователь уже существует'});
    case 'MongooseError':
      return res.status(500).send({message: 'Ошибка базы данных'});
    case 'ReferenceError':
      return res.status(400).send({message: 'Неверные данные'});
    case 'Error':
      return res.status(400).send({message: 'Неверные данные'});
    default:
      return res.status(500).send({message: 'Ошибка сервера'});
  }
};

module.exports = error;