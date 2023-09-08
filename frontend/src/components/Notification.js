export function Notification({ onAction }) {
  return (
    <section
      className={`notification ${
        onAction?.isSuccess
          ? `notification_type_success`
          : `notification_type_error`
      } ${onAction?.isActive && 'notification_active'}`}
    >
      <span className="notification__description">{onAction?.message}</span>
    </section>
  );
}
