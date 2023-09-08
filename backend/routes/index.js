const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const userRouter = require('./users');
const cardRouter = require('./cards');

const NotFoundError = require('../errors/NotFoundError');

const { createNewUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const linkCheck = require('../utils/constants');

// логин
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

// регистрация
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string()
        .regex(linkCheck),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createNewUser,
);

router.use(auth); // авторизация, защищает все остальные руты которые находятся ниже
router.use(userRouter);
router.use(cardRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Обращение к несуществующему пути'));
});

module.exports = router;
