const cardsRouter = require('express').Router();
const {
  getCards, createCard, likeCard, deleteCard, dislikeCard,
} = require('../controllers/cards');

cardsRouter.get('/cards', getCards);
cardsRouter.post('/cards', createCard);
cardsRouter.put('/cards/:_id/likes', likeCard);
cardsRouter.delete('/cards/:_id', deleteCard);
cardsRouter.delete('/cards/:_id/likes', dislikeCard);

module.exports = cardsRouter;
