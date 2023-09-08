import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export function Card({ card, onCardClick, onCardLike, onClickDelete }) {
  const currentUser = React.useContext(CurrentUserContext);

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card, currentUser?._id);
  }

  function handleDeleteClick() {
    onClickDelete(card);
  }

  //проверяем карточка моя или нет
  const isOwn = card.owner === currentUser?._id;

  //проверяем есть ли мои лайки на в массиве лайков
  const isLiked = card.likes.some((like) => {
    return like === currentUser?._id;
  });

  return (
    <div className="cards__item">
      <img
        className="cards__image"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
        role="button"
      />
      <div className="cards__container">
        <h2 className="cards__title">{card.name}</h2>
        <div className="card__like-container">
          <button
            className={`cards__like-button ${
              isLiked && 'cards__like-button_active'
            }`}
            type="button"
            onClick={handleLikeClick}
          ></button>
          <span className="card__like-counter">{card.likes.length}</span>
        </div>
        {/* если id карточки и мой id совпадают показываем кнопку удаления */}
        {isOwn && (
          <button
            className="cards__trash-button"
            type="button"
            onClick={handleDeleteClick}
          ></button>
        )}
      </div>
    </div>
  );
}
