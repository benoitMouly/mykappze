import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications } from '../../features/notifications/notificationSlice';

export function NotificationPopup() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications.items);
  const notificationsStatus = useSelector((state) => state.notifications.status);
  const notificationsError = useSelector((state) => state.notifications.error);

  useEffect(() => {
    if (notificationsStatus === 'idle') {
      dispatch(fetchNotifications());
    }
  }, [notificationsStatus, dispatch]);

  //...

  return (
    <div>
      {/* Show notifications here */}
      {notifications.map((notification, index) => (
        <div key={index}>
          {/* Show notification data here */}
        </div>
      ))}
    </div>
  );
}
