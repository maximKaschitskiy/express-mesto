const Card = require('../models/cards');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: "Переданы некорректные данные при создании карточки" });
      } else {
        res.status(500).send({ message: err });
      }
    });
};

const deleteCard = (req, res) => {
  const id = req.params._id;
  Card.findByIdAndDelete(id)
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: "Карточка с указанным _id не найдена" });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } }
  )
  .then((likes) => {
    res.status(200).send(likes);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(400).send({ message: "Переданы некорректные данные для постановки/снятии лайка" });
    }
    else if (err.message === 'NotValidId') {
      res.status(404).send({ message: "Передан несуществующий _id карточки" });
    } else {
      res.status(500).send({ message: err });
    }
  });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } }
  )
    .then((likes) => {
      res.status(200).send(likes);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: "Переданы некорректные данные для постановки/снятии лайка" });
      }
      else if (err.message === 'NotValidId') {
        res.status(404).send({ message: "Передан несуществующий _id карточки" });
      } else {
        res.status(500).send({ message: err });
      }
    });
};

module.exports = {
  getCards, createCard, likeCard, deleteCard, dislikeCard,
};