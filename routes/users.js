const usersRouter = require('express').Router();
const {
  getUsers, getUserId, getCurrentUserInfo, updateUser, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.get('/users/:id', getUserId);
usersRouter.get('/users/me', getCurrentUserInfo);
usersRouter.patch('/users/me', updateUser);
usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = usersRouter;
