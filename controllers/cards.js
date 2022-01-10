const Card = require('../models/cards');

const getCards = (req, res, next) => {
  Card.find({})
    .orFail()
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .orFail()
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const id = req.params._id;
  Card.findById(id)
    .orFail()
    .then((card) => {
      if (card.owner.toString() !== id) {
        res.status(404).send({ message: 'Отсутствуют права' });
      } else {
        Card.findByIdAndDelete(id)
          .then((card) => {
            res.status(200).send(card);
          })
          .catch(next);
      }
    })
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
  )
    .orFail()
    .then((likes) => {
      res.status(200).send(likes);
    })
    .catch((err) => {
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
  )
    .orFail()
    .then((likes) => {
      res.status(200).send(likes);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCards, createCard, likeCard, deleteCard, dislikeCard,
};
