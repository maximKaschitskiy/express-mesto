const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { Unauthorized } = require('./errors/unauthorized');
const { NotFound } = require('./errors/notFound');

const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Подключение к БД удалось'))
  .catch(() => console.log('Подключение к БД не удалось'));

mongoose.connection.on('open', () => console.log('Подключение к БД активно'));
mongoose.connection.on('error', () => console.log('Подключение к БД прервано'));

app.use(bodyParser.json());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(5).max(30),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().pattern(/^[A-Za-z0-9]{5,30}$/),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/),
    }),
  }),
  createUser,
);

app.use(auth);
app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);
app.use('*', (req, res, next) => {
  if (!req.user) {
    next(new Unauthorized('Неавторизовано'));
  }
  next(new NotFound('Не найдено'));
});

app.use(errors());
app.use(errorMiddleware);
