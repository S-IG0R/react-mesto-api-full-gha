const {
  HTTP_STATUS_OK, // 200
  HTTP_STATUS_CREATED, // 201
} = require('http2').constants;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

require('dotenv').config();

const { JWT_SECRET, NODE_ENV } = process.env;

const SALT_ROUNDS = 12;

// получаем всех пользователей
const getAllUsers = (req, res, next) => {
  return User.find({})
    .then((users) => {
      return res.status(HTTP_STATUS_OK).send(users);
    })
    .catch(next);
};

// получаем конкретного пользователя по id
const getUserById = (req, res, next) => {
  return User.findById(req.params.userId)
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден')) // когда приходит пусто user, создаем ошибку и переходим в блок catch, там ее отлавливаем
    .then((user) => {
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (
        err instanceof mongoose.Error.ValidationError
        || err instanceof mongoose.Error.CastError
      ) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

// создаем нового пользователя
const createNewUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!password || !email) {
    throw new BadRequestError('Поля email и password не могут быть пустыми');
  }
  bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((newUser) => {
        return res
          .status(HTTP_STATUS_CREATED)
          .send({
            name: newUser.name,
            about: newUser.about,
            avatar: newUser.avatar,
            email: newUser.email,
          });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return next(new ConflictError('Такой пользователь уже зарегистрирован'));
        }
        if (err instanceof mongoose.Error.ValidationError) {
          return next(new BadRequestError('Переданы некорректные данные'));
        }
        return next(err);
      });
  });
};

// обновляем профиль пользователя
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => {
      res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (
        err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError
      ) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

// обновляем аватар пользователя
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Запрашиваемый пользователь не найден'))
    .then((user) => {
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (
        err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError
      ) {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

// залогиниваемся
const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!password || !email) {
    throw new BadRequestError('Поля email и password не могут быть пустыми');
  }
  User.findOne({ email })
    .select('+password') // select('+password') - добавляет пароль в запрос
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверно указан email или password');
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError('Неверно указан email или password');
        }
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secret_key', {
          expiresIn: '7d', // срок годности 7 дней
        });
        return res
          .status(HTTP_STATUS_OK)
          .send({ token });
        // .cookie('jwt', token, {  // не работает из-за тестов: пустое тело
        //   maxAge: 3600000 * 24 * 7,
        //   httpOnly: true,
        //   sameSite: true,
        // })
        // .end();
      });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findOne({ _id })
    .then((currentUser) => {
      res.status(HTTP_STATUS_OK).send(currentUser);
    })
    .catch(next);
};

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUser,
};
