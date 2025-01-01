// actions/notifications.ts
"use server"

import { db } from '@/lib/db';

export async function getUnreadCounts() {
  try {
    const [donations, messages] = await Promise.all([
      db.donation.count({ where: { isRead: false } }),
      db.contact.count({ where: { isRead: false } })
    ]);
    
    return { donations, messages };
  } catch (error) {
    console.error('Error fetching unread counts:', error);
    return { donations: 0, messages: 0 };
  }
}