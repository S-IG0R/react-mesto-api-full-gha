const mongoose = require('mongoose');
const linkCheck = require('../utils/constants');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: [2, 'Минимальная длина поля "name" - 2 символа'],
      maxlength: [30, 'Максимальная длина поля "name" - 30 символов'],
    },
    link: {
      type: String,
      required: true,
      validate: linkCheck,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false }, // отключает __v
);

module.exports = mongoose.model('card', cardSchema);
