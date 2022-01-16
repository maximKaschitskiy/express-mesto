const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, createCard, likeCard, deleteCard, dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCards);

cardsRouter.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/),
    }),
  }),
  createCard,
);

cardsRouter.put(
  '/cards/:_id/likes',
  celebrate({
    body: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  likeCard,
);

cardsRouter.delete(
  '/cards/:_id',
  celebrate({
    body: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  deleteCard,
);

cardsRouter.delete(
  '/cards/:_id/likes',
  celebrate({
    body: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
    }),
  }),
  dislikeCard,
);

module.exports = cardsRouter;
