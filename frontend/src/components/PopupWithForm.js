import { usePopupClose } from '../hooks/usePopupClose';

export function PopupWithForm({
  name,
  title,
  children,
  isOpen,
  onClose,
  buttonText,
  onSubmit,
}) {
  
  usePopupClose(isOpen, onClose);

  return (
    <section className={`popup popup_type_${name} ${isOpen && `popup_opened`}`}>
      <div className="popup__container">
        <p className="popup__title">{title}</p>
        <button className="popup__close-btn" type="button" onClick={onClose} />
        <form
          className={`popup__form popup__form_type_${name}`}
          name={`${name}-form`}
          onSubmit={onSubmit}
        >
          {children}
          <button className="popup__submit-btn" type="submit">
            {buttonText}
          </button>
        </form>
      </div>
    </section>
  );
}
