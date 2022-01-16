const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcrypt');
const { Unauthorized } = require('../errors/unauthorized');

const urlPattern = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => urlPattern.test(url),
      message: 'Некорректный URL',
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (validate) => isEmail(validate),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function userFind(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Неверный логин или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (!match) {
            throw new Unauthorized('Неверный логин или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
