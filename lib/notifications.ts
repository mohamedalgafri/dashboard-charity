// lib/notifications.ts
import { SidebarNavItem } from '@/types';
import { Socket } from 'socket.io-client';

export const NotificationTypes = {
  DONATION: 'new-donation',
  CONTACT: 'new-contact',
  READ_DONATIONS: 'read-donations',
  READ_CONTACTS: 'read-contacts'
} as const;

export function emitNotification(socket: Socket | null, type: string, data: any) {
  if (!socket) {
    console.warn('Socket not initialized');
    return;
  }
  
  socket.emit(type, data);
}

export function updateBadgeCount(
  links: SidebarNavItem[],
  path: string,
  increment: boolean = true
): SidebarNavItem[] {
  return links.map(section => ({
    ...section,
    items: section.items.map(item => {
      if (item.href === path) {
        const currentBadge = item.badge || 0;
        return {
          ...item,
          badge: increment ? currentBadge + 1 : undefined
        };
      }
      return item;
    })
  }));
}