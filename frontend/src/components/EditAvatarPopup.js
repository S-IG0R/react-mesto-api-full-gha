import { useEffect, useRef } from 'react';
import { PopupWithForm } from './PopupWithForm';

export function EditAvatarPopup({
  isOpen,
  onClose,
  onUpdateAvatar,
  onLoading,
}) {
  const inputRef = useRef();

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onUpdateAvatar({
      avatar: inputRef.current.value,
    });
  };

  useEffect(() => {
    //проверяем открыт ли попап
    if (isOpen) {
      inputRef.current.value = '';
    }
  }, [isOpen]);

  return (
    <PopupWithForm
      name="edit-avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      buttonText={`Сохранить${onLoading}`}
      onSubmit={handleSubmit}
    >
      <input
        className="popup__input popup__input_el_pic-url"
        name="avatar"
        id="input-avatar-url"
        type="url"
        placeholder="Ссылка на аватарку"
        ref={inputRef}
        required
      />
      <span className="input-avatar-url-error popup__input-error"></span>
    </PopupWithForm>
  );
}
