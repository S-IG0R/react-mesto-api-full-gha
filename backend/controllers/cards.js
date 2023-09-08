const {
  HTTP_STATUS_OK, // 200
  HTTP_STATUS_CREATED, // 201
} = require('http2').constants;

const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

// получение всех карточек
const getAllCards = (req, res, next) => {
  return Card.find({})
    .then((cards) => {
      return res.status(HTTP_STATUS_OK).send(cards);
    })
    .catch(next);
};

// создание карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((newCard) => {
      return res.status(HTTP_STATUS_CREATED).send(newCard);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

// удаление карточки
const deleteCard = (req, res, next) => {
  return Card.findById({ _id: req.params.cardId })
    .orFail(new NotFoundError('Запрашиваемая карточка не найдена'))
    .then((card) => {
      if (card.owner.valueOf() !== req.user._id) {
        throw new ForbiddenError('Удаление чужой карточки запрещено');
      }
      return Card.deleteOne(card) // удаляет найденную карточку
        .orFail(new NotFoundError('Запрашиваемая карточка не найдена'))
        .then(() => {
          return res
            .status(HTTP_STATUS_OK)
            .send({ message: 'Карточка удалена' });
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

// ставим лайк карточке
const putLike = (req, res, next) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }, // будет возвращать обновленные данные
  )
    .orFail(new NotFoundError('Запрашиваемая карточка не найдена'))
    .then((response) => {
      return res.status(HTTP_STATUS_OK).send(response);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

// удаляем лайк с карточки
const deleteLike = (req, res, next) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError('Запрашиваемая карточка не найдена'))
    .then((response) => {
      return res.status(HTTP_STATUS_OK).send(response);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
