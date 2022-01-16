const Card = require('../models/cards');
const { BadRequest } = require('../errors/badRequest');
const { Forbidden } = require('../errors/forbidden');
const { NotFound } = require('../errors/notFound');

const getCards = (req, res, next) => {
  Card.find({})
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
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequest('Переданы некорректные данные'),
        );
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const id = req.user._id;
  Card.findById(req.params._id)
    .then((card) => {
      if (!card) {
        next(
          new NotFound('Не найдено'),
        );
      }
      if (card.owner.toString() !== id) {
        next(
          new Forbidden('Нет прав'),
        );
      } else {
        Card.findByIdAndDelete(req.params._id)
          .then((deletedCard) => {
            res.status(200).send(deletedCard);
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const likeCard = async (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => {
      if (!likes) {
        next(
          new NotFound({ message: 'Не найдено' }),
        );
      } else {
        res.status(200).send(likes);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequest({ message: 'Переданы некорректные данные' }),
        );
      }
      next(err);
    });
};

const dislikeCard = async (req, res, next) => {
  await Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((likes) => {
      if (!likes) {
        next(
          new NotFound({ message: 'Не найдено' }),
        );
      }
      res.status(200).send(likes);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(
          new BadRequest({ message: 'Переданы некорректные данные' }),
        );
      }
      next(err);
    });
};

module.exports = {
  getCards, createCard, likeCard, deleteCard, dislikeCard,
};
