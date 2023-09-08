import { usePopupClose } from '../hooks/usePopupClose';

export function ImagePopup({ card, onClose }) {

  //импорт кастомного хука, в качестве первого аргумента проверка если ссылка
  //служит как индикатор открытого поапа, потому что не передается isOpen
  usePopupClose(card?.link, onClose);

  return (
    <section
      className={`popup popup_type_view-photo ${card && 'popup_opened'}`}
    >
      <div className="popup__container popup__container_type_zoom-photo">
        <img className="popup__image" src={card?.link} alt={card?.name} />
        <p className="popup__picture-caption">{card?.name}</p>
        <button
          className="popup__close-btn"
          type="button"
          onClick={onClose}
        ></button>
      </div>
    </section>
  );
}
