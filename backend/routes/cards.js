const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const linkCheck = require('../utils/constants');

const {
  getAllCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
} = require('../controllers/cards');

// получаем все карточки
router.get(
  '/cards',
  celebrate({
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  getAllCards,
);

// создаем новую карточку
router.post(
  '/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .regex(linkCheck)
        .required(),
    }),
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  createCard,
);

// удаляем карточку по id карточки
router.delete(
  '/cards/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  deleteCard,
);

// ставим лайк
router.put(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  putLike,
);

// убираем лайк
router.delete(
  '/cards/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
    headers: Joi.object()
      .keys({ authorization: Joi.string().required() })
      .unknown(),
  }),
  deleteLike,
);

module.exports = router;
