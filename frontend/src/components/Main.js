import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { Card } from './Card';

export function Main({
  onEditProfile,
  onAddPlace,
  onEditAvatar,
  onCardClick,
  onCardLike,
  onClickDelete,
  cards,
}) {
  //Передаем в хук контекст. с полученными данными с сервера и подставляем данные куда нужно
  const currentUser = React.useContext(CurrentUserContext);
  return (
    <main className="content">
      <section className="profile">
        <div className="profile__common-container">
          <button className="profile__avatar-edit-btn" onClick={onEditAvatar}>
            <img
              src={currentUser?.avatar}
              alt="аватарка"
              className="profile__avatar"
            />
          </button>
          <div className="profile__text-container">
            <h1 className="profile__hero-name">{currentUser?.name}</h1>
            <p className="profile__hero-job">{currentUser?.about}</p>
          </div>
          <button
            className="profile__edit-button"
            type="button"
            onClick={onEditProfile}
          ></button>
        </div>
        <button
          className="profile__add-button"
          type="button"
          onClick={onAddPlace}
        ></button>
      </section>
      <section className="cards" aria-label="Фотогалерея">
        {cards.map((card) => {
          return (
            <Card
              key={card._id}
              card={card}
              onCardClick={onCardClick}
              onCardLike={onCardLike}
              onClickDelete={onClickDelete}
            />
          );
        })}
      </section>
    </main>
  );
}
