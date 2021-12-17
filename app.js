const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '61bb24b32334abed87a08652',
  };
  next();
});

app.use(bodyParser.json());
app.use('/', usersRouter);
app.use('/', cardsRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});