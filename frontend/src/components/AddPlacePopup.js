import { useEffect } from 'react';
import { PopupWithForm } from './PopupWithForm';
import { useForm } from '../hooks/useForm';

export function AddPlacePopup({ isOpen, onClose, onAddCard, onLoading }) {
  //импорт кастомного хука
  const { values, setValues, handleChange } = useForm({ name: '', link: '' });

  const handleSubmit = (evt) => {
    evt.preventDefault();
    onAddCard(values);
  };

  useEffect(() => {
    //проверяем открыт ли попап
    if (isOpen) {
      setValues({ name: '', link: '' });
    }
  }, [isOpen, setValues]);

  return (
    <PopupWithForm
      name="add-pic"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={`Создать${onLoading}`}
    >
      <input
        className="popup__input popup__input_el_pic-name"
        name="name"
        id="input-pic-name"
        type="text"
        placeholder="Название"
        minLength="2"
        maxLength="30"
        value={values.name}
        onChange={handleChange}
        required
      />
      <span className="input-pic-name-error popup__input-error"></span>
      <input
        className="popup__input popup__input_el_pic-url"
        name="link"
        id="input-pic-url"
        type="url"
        placeholder="Ссылка на картинку"
        value={values.link}
        onChange={handleChange}
        required
      />
      <span className="input-pic-url-error popup__input-error"></span>
    </PopupWithForm>
  );
}
