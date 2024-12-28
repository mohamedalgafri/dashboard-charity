// components/RealTimeBadge.tsx
'use client';

import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { pusherClient } from '@/lib/pusher';

interface RealTimeBadgeProps {
  initialCount: number;
  type: 'donations' | 'contacts';
}

export function RealTimeBadge({ initialCount, type }: RealTimeBadgeProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const channel = pusherClient.subscribe(type);
    
    channel.bind(`new-${type.slice(0, -1)}`, () => {
      setCount((prev) => prev + 1);
      
      // تحديث badge عند قراءة الإشعارات
      if (window.location.pathname === `/admin/${type}`) {
        setCount(0);
      }
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [type]);

  if (count === 0) return null;

  return (
    <Badge 
      className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full rtl:ml-0 rtl:mr-auto"
    >
      {count}
    </Badge>
  );
}