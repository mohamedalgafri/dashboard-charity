'use client';

import { useEffect, useRef, useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { pusherClient } from '@/lib/pusher';
import { useAppDispatch } from '@/store/hooks';
import { addNewDonation } from '@/store/slices/notificationsSlice';
import { addDonation } from '@/store/slices/donationsSlice';

export function NotificationsProvider() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // إعداد مستمعات التفاعل
  useEffect(() => {
    const handleInteraction = () => {
      if (!audioRef.current) {
        audioRef.current = new Audio('/notification-18-270129.mp3');
        audioRef.current.load();
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // إعداد Pusher والإشعارات
  useEffect(() => {
    const channel = pusherClient.subscribe('donations');
    
    channel.bind('new-donation', (data: any) => {
      console.log("New donation received:", data);
      
      // تشغيل الصوت
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }

      // تحديث Redux
      dispatch(addNewDonation(data));
      dispatch(addDonation(data.donation));
      
      // عرض الإشعار
      const donation = data.donation;
      toast({
        title: "تبرع جديد!",
        description: (
          <div className="rtl:text-right ltr:text-left">
            <p>
              {donation.donor.anonymous ? " متبرع مجهول "   : donation.donor.name} 
              تبرع بمبلغ {donation.amount}$
            </p>
            <p>للحملة: {donation.project.title}</p>
          </div>
        ),
        duration: 5000,
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [toast, dispatch]);

}