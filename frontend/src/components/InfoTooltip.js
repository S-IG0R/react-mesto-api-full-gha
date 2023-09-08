import { usePopupClose } from '../hooks/usePopupClose';
import errorIcon from '../images/error.svg';
import successIcon from '../images/success.svg';

export const InfoTooltip = ({ popupState, onClose }) => {

  usePopupClose(popupState.isOpen, onClose);
  
  return (
    <section
      className={`popup popup_type_info ${
        popupState.isOpen && `popup_opened`
      }`}
    >
      <div className="popup__container">
        {popupState.isSuccess ? (
          <img
            className="popup__image-info"
            alt="Информационная иконка"
            src={successIcon}
          />
        ) : (
          <img
            className="popup__image-info"
            alt="Информационная иконка"
            src={errorIcon}
          />
        )}
        <p className="popup__title popup__title_type_info">
          {popupState.isSuccess
            ? 'Вы успешно зарегистрировались!'
            : 'Что-то пошло не так! Попробуйте ещё раз'}
        </p>
        <button className="popup__close-btn" type="button" onClick={onClose} />
      </div>
    </section>
  );
};
