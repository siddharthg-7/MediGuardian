import { useState, useEffect } from 'react';
import { messaging } from '../services/firebase';
import { getToken, onMessage } from 'firebase/messaging';

export const useNotifications = () => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const currentToken = await getToken(messaging, {
          vapidKey: 'BFq6laOSoQTpjkIhumcYMfl2bEJVsLm4pMfvqAjOgifIby-nFjcR9bSUzeiKSJcnI0LiAekj50XitPYFiNiNfvk' 
        });

        if (currentToken) {
          setToken(currentToken);
          // In Phase 2, we would send this token to our Express backend
          console.log('FCM Token:', currentToken);
        }
      }
    } catch (err) {
      setError('Unable to get permission for notifications.');
      console.error(err);
    }
  };

  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received: ', payload);
      // Show toast or browser notification
      new Notification(payload.notification?.title || 'Reminder', {
        body: payload.notification?.body,
        icon: '/favicon.ico'
      });
    });

    return () => unsubscribe();
  }, []);

  return { token, error, requestPermission };
};
