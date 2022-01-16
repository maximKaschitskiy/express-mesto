const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserId, getCurrentUserInfo, updateUser, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);

usersRouter.get('/users/me', getCurrentUserInfo);

usersRouter.get(
  '/users/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().required().hex().min(2)
        .max(24),
    }),
  }),
  getUserId,
);

usersRouter.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUser,
);

usersRouter.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().regex(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/),
    }),
  }),
  updateAvatar,
);

module.exports = usersRouter;
