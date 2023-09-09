const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limit = require('./middlewares/rateLimit');
const router = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
require('dotenv').config();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env; // переменные окружения

const app = express();

app.use(cors);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  });

// ограничитель запросов к серверу
app.use(limit);

// защита от некоторых широко известных веб-уязвимостей
app.use(helmet());

// парсер тела запросов вместо body-parser
app.use(express.json());

// логгер запросов
app.use(requestLogger);

// для краштеста
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// все руты приложения
app.use(router);

// логгер ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// центр. обработки ошибок
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App started at port: ${PORT}`);
});
