import { useNotificationActions, useNotificationState } from '../../contexts/NotificationContext';

const GlobalNotificationBanner = () => {
  const notification = useNotificationState();
  const { clearNotification } = useNotificationActions();

  if (!notification) {
    return null;
  }

  const tone = notification.type === 'error' ? 'error' : notification.type === 'success' ? 'success' : 'info';

  return (
    <div className="impact-notice-card" data-tone={tone} role="status">
      <div className="impact-notice-card__row">
        <span className="impact-notice-card__text">{notification.text}</span>
        <button
          type="button"
          onClick={clearNotification}
          className="impact-notice-card__dismiss"
          aria-label="Dismiss notification"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default GlobalNotificationBanner;
