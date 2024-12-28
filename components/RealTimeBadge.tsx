// components/RealTimeBadge.tsx
'use client';

import { Badge } from "@/components/ui/badge";
import { useAppSelector } from '@/store/hooks';

interface RealTimeBadgeProps {
  type: 'donations' | 'contacts';
}

export function RealTimeBadge({ type }: RealTimeBadgeProps) {
  const count = useAppSelector((state) => 
    type === 'donations' 
      ? state.notifications.unreadDonations 
      : state.notifications.unreadMessages
  );

  if (count === 0) return null;

  return (
    <Badge 
      className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full rtl:ml-0 rtl:mr-auto"
    >
      {count}
    </Badge>
  );
}