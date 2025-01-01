'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getUnreadCounts } from '@/actions/donation';

export function DashboardInit() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initNotifications = async () => {
      const counts = await getUnreadCounts();
      dispatch({
        type: 'notifications/setUnread',
        payload: {
          unreadDonations: counts.donations,
          unreadMessages: counts.messages
        }
      });
    };

    initNotifications();
  }, [dispatch]);

  return null;
}