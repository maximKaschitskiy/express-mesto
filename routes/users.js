const usersRouter = require('express').Router();
const {
  getUsers, createUser, getUserId, updateUser, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/users', getUsers);
usersRouter.post('/users', createUser);
usersRouter.get('/users/:id', getUserId);
usersRouter.patch('/users/me', updateUser);
usersRouter.patch('/users/me/avatar', updateAvatar);

module.exports = usersRouter;