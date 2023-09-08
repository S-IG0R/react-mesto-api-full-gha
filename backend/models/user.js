const mongoose = require('mongoose');
const validator = require('validator');
const linkCheck = require('../utils/constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
      maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
      maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: linkCheck,
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      require: true,
      unique: true,
      validate: {
        validator: (email) => {
          return validator.isEmail(email);
        },
        message: 'Некорректный Email',
      },
    },
    password: {
      type: String,
      require: true,
      select: false, // запрещает возврат в ответе пароля
    },
  },
  { versionKey: false }, // отключает __v
);

module.exports = mongoose.model('user', userSchema);
