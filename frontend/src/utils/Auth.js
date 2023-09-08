const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_BASE_URL
    : 'http://localhost:3000';

// регистрация
export const registration = (email, password) => {
  return fetch(`${BASE_URL}/signup`, doRequest(email, password)).then(
    getResponse
  );
};

// авторизация
export const login = (email, password) => {
  return fetch(`${BASE_URL}/signin`, doRequest(email, password)).then(
    getResponse
  );
};

// проверка токена
export const checkToken = (token) => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  }).then(getResponse);
};

const doRequest = (email, password) => {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, email }),
  };
};

const getResponse = (res) => {
  return res.ok
    ? res.json()
    : Promise.reject(`произошла ошибка: ${res.status}`);
};
