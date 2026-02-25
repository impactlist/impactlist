import { useNotifications } from '../../contexts/NotificationContext';

const GlobalNotificationBanner = () => {
  const { notification, clearNotification } = useNotifications();

  if (!notification) {
    return null;
  }

  return (
    <div className="mx-auto mt-4 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div
        className={`rounded-md px-4 py-3 text-sm ${
          notification.type === 'error'
            ? 'bg-red-50 text-red-700'
            : notification.type === 'info'
              ? 'bg-slate-100 text-slate-700'
              : 'bg-emerald-50 text-emerald-700'
        }`}
        role="status"
      >
        <div className="flex items-start justify-between gap-3">
          <span>{notification.text}</span>
          <button
            type="button"
            onClick={clearNotification}
            className="shrink-0 rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset ring-current/30 hover:bg-black/5"
            aria-label="Dismiss notification"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalNotificationBanner;
