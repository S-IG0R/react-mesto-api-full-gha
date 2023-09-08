import { PopupWithForm } from './PopupWithForm';

export function PopupWithConfirmation({ onClose, isOpen, onLoading, onConfirm }) {
  const handleSubmit = (evt) => {
    evt.preventDefault();
    onConfirm(isOpen);
  };
  return (
    <PopupWithForm
      name="confirm-delete"
      title="Вы уверены?"
      onClose={onClose}
      isOpen={isOpen}
      buttonText={`Да${onLoading}`}
      onSubmit={handleSubmit}
    />
  );
}
