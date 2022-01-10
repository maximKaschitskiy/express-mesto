const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const error = require('./middlewares/error');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Подключение к БД удалось'))
  .catch(() => console.log('Подключение к БД не удалось'));

mongoose.connection.on('open', () => console.log('Подключение к БД активно'));
mongoose.connection.on('error', () => console.log('Подключение к БД прервано'));

app.use(bodyParser.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/', auth, usersRouter);
app.use('/', auth, cardsRouter);
app.use((req, res) => {
  res.status(404).send({ message: '404: Not found' });
});
app.use(error);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
