import { useContext, useEffect } from 'react';
import { PopupWithForm } from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { useForm } from '../hooks/useForm';

export function EditProfilePopup({ isOpen, onClose, onUpdateUser, onLoading }) {
  //подписка на контекст данных о пользователе
  const currentUser = useContext(CurrentUserContext);

  //импорт кастомного хука обрабатывающего инпуты
  const { values, setValues, handleChange } = useForm({ name: '', about: '' });

  //обработка сабмита формы
  const handleSubmit = (evt) => {
    evt.preventDefault();
    //передаем данные из инпутов в обработчик api запроса
    onUpdateUser(values);
  };

  //установка данных пользователя в инпуты
  useEffect(() => {
    //проверяем открыт ли попап
    if (isOpen) {
      setValues({
        name: currentUser?.name ?? '',
        about: currentUser?.about ?? '',
      });
    }
  }, [currentUser, isOpen, setValues]);

  return (
    <PopupWithForm
      name="edit-profile"
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonText={`Сохранить${onLoading}`}
    >
      <input
        className="popup__input popup__input_el_name"
        name="name"
        id="input-name"
        type="text"
        placeholder="Имя"
        minLength="2"
        maxLength="40"
        value={values.name}
        onChange={handleChange}
        required
      />
      <span className="input-name-error popup__input-error"></span>
      <input
        className="popup__input popup__input_el_job"
        name="about"
        id="input-job"
        type="text"
        placeholder="Род деятельности"
        minLength="2"
        maxLength="200"
        value={values.about}
        onChange={handleChange}
        required
      />
      <span className="input-name-error popup__input-error"></span>
    </PopupWithForm>
  );
}
