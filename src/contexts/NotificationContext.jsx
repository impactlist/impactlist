import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const DEFAULT_AUTO_DISMISS_MS = 6000;

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
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

  const contextValue = useMemo(
    () => ({
      notification,
      showNotification,
      clearNotification,
    }),
    [notification, showNotification, clearNotification]
  );

  return <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>;
};

export default NotificationContext;
