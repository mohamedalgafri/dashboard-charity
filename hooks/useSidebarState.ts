// hooks/useSidebarState.ts
import { useState, useCallback } from 'react';
import { SidebarNavItem } from '@/types';
import { updateBadgeCount } from '@/lib/notifications';

export function useSidebarState(initialLinks: SidebarNavItem[]) {
  const [links, setLinks] = useState(initialLinks);

  const incrementBadge = useCallback((path: string) => {
    setLinks(prevLinks => updateBadgeCount(prevLinks, path, true));
  }, []);

  const clearBadge = useCallback((path: string) => {
    setLinks(prevLinks => updateBadgeCount(prevLinks, path, false));
  }, []);

  return {
    links,
    setLinks,
    incrementBadge,
    clearBadge
  };
}