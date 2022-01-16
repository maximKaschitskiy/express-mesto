const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { BadRequest } = require('../errors/badRequest');
const { NotFound } = require('../errors/notFound');
const { Conflict } = require('../errors/conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      next(err);
    });
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  const hash = await bcrypt.hash(password, 10);
  User.create({
    name, about, avatar, email, password: hash,
  })
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Ошибка валидации'),
        );
      }
      if (err.code === 11000) {
        next(
          new Conflict('Пользователь существует'),
        );
      }
    })
    .catch((err) => {
      next(err);
    });
};

const getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(
          new NotFound('Пользователь не найден'),
        );
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      next(err);
    });
};

const getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        next(
          new NotFound('Пользователь не найден'),
        );
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequest('Невалидный id'),
        );
      }
      next(err);
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updUser) => {
      if (!updUser) {
        next(
          new NotFound('Пользователь не найден'),
        );
      } else {
        res.status(200).send(updUser);
      }
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError': {
          next(
            new BadRequest('Переданы некорректные данные'),
          );
          break;
        }
        case 'CastError': {
          next(
            new BadRequest('Переданы некорректные данные'),
          );
          break;
        }
        case 'MongoError': {
          if (err.code === 11000) {
            next(
              new Conflict('Пользователь уже существует'),
            );
          }
          break;
        }
        default:
          next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newAvatar) => {
      if (!newAvatar) {
        next(
          new NotFound('Пользователь не найден'),
        );
      } else {
        res.status(200).send(newAvatar);
      }
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError': {
          next(
            new BadRequest('Переданы некорректные данные'),
          );
          break;
        }
        case 'CastError': {
          next(
            new BadRequest('Переданы некорректные данные'),
          );
          break;
        }
        case 'MongoError': {
          if (err.code === 11000) {
            next(
              new Conflict('Пользователь уже существует'),
            );
          }
          break;
        }
        default:
          next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(
      new BadRequest('Ошибка валидации'),
    );
  } else {
    User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' },
        );
        res.status(200).send({ token });
      })
      .catch((err) => {
        next(err);
      });
  }
};

module.exports = {
  getUsers, createUser, getCurrentUserInfo, getUserId, updateUser, updateAvatar, login,
};
