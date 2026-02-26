import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const DEFAULT_AUTO_DISMISS_MS = 6000;

const NotificationStateContext = createContext();
const NotificationActionsContext = createContext();

const useRequiredContext = (context, contextName, hookName) => {
  const value = useContext(context);
  if (value === undefined) {
    throw new Error(`${hookName} must be used within a ${contextName}`);
  }
  return value;
};

export const useNotifications = () => {
  const notification = useRequiredContext(NotificationStateContext, 'NotificationProvider', 'useNotifications');
  const actions = useRequiredContext(NotificationActionsContext, 'NotificationProvider', 'useNotifications');
  return {
    notification,
    ...actions,
  };
};

export const useNotificationState = () => {
  return useRequiredContext(NotificationStateContext, 'NotificationProvider', 'useNotificationState');
};

export const useNotificationActions = () => {
  return useRequiredContext(NotificationActionsContext, 'NotificationProvider', 'useNotificationActions');
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const showNotification = useCallback((type, text, options = {}) => {
    if (!text) {
      return;
    }

    const persistent = options.persistent ?? type === 'error';
    const durationMs = options.durationMs ?? DEFAULT_AUTO_DISMISS_MS;

    setNotification({
      id: `${Date.now()}-${Math.random()}`,
      type,
      text,
      persistent,
      durationMs,
    });
  }, []);

  useEffect(() => {
    if (!notification || notification.persistent) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setNotification((current) => {
        if (!current || current.id !== notification.id) {
          return current;
        }
        return null;
      });
    }, notification.durationMs);

    return () => clearTimeout(timeoutId);
  }, [notification]);

  const actionsValue = useMemo(
    () => ({
      showNotification,
      clearNotification,
    }),
    [showNotification, clearNotification]
  );

  return (
    <NotificationActionsContext.Provider value={actionsValue}>
      <NotificationStateContext.Provider value={notification}>{children}</NotificationStateContext.Provider>
    </NotificationActionsContext.Provider>
  );
};
