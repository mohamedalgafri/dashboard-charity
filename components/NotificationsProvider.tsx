// components/NotificationsProvider.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { pusherClient } from '@/lib/pusher';

export function NotificationsProvider() {
  const { toast } = useToast();
  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // إنشاء عنصر الصوت في جانب العميل
    notificationSound.current = new Audio('/notification-18-270129.mp3');

    const channel = pusherClient.subscribe('donations');
    
    channel.bind('new-donation', (data: any) => {
      console.log("New donation received:", data);
      
      // تشغيل الصوت
      notificationSound.current?.play().catch(error => {
        console.error('Error playing sound:', error);
      });
      
      toast({
        title: "تبرع جديد!",
        description: (
          <div className="rtl:text-right ltr:text-left">
            <p>{data.donation.donorName} تبرع بمبلغ {data.donation.amount}</p>
            <p>للحملة: {data.donation.projectTitle}</p>
          </div>
        ),
        duration: 5000,
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [toast]);

  return null;
}