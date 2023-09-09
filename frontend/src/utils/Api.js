class Api {
  constructor({ url }) {
    this._url = url();
  }

  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      headers: this._headers()
    }).then(this._result);
  }

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      headers: this._headers()
    }).then(this._result);
  }

  setUserAvatar(avatar) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers(),
      body: JSON.stringify(avatar),
    }).then(this._result);
  }

  setProfileData(userData) {
    return fetch(`${this._url}/users/me/`, {
      method: 'PATCH',
      headers: this._headers(),
      body: JSON.stringify(userData),
    }).then(this._result);
  }

  addNewCard(cardData) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(cardData),
    }).then(this._result);
  }

  deleteCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers(),
    }).then(this._result);
  }

  putLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: this._headers(),
    }).then(this._result);
  }

  deleteLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: this._headers(),
    }).then(this._result);
  }

  setToken(token) {
    this._token = token
  }

  _result(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`произошла ошибка: ${res.status}`);
    }
  }

  _headers() {
    return {
      authorization: `Bearer ${this._token}`,
      'Content-Type': 'application/json',
    }
  }
}

export const api = new Api({
  url: () => {
    return process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_BASE_URL
    : 'http://localhost:3000'
  },
});
