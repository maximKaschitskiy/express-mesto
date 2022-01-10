const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      next(err);
    });
};

const createUser = async (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  User.create({ name, about, avatar, email, password: hash })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const getCurrentUserInfo = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      next(err);
    });
};

const getUserId = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
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
      res.status(200).send(updUser);
    })
    .catch((err) => {
      next(err);
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
      res.status(200).send(newAvatar);
    })
    .catch((err) => {
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ message: 'Ошибка валидации' });
  } else {
  return User.findUserByCredentials(email, password)
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
  };
};


module.exports = {
  getUsers, createUser, getCurrentUserInfo, getUserId, updateUser, updateAvatar, login
};
