// hooks/useNotificationSound.ts
import { useEffect, useRef } from 'react';

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // تأكد من أن الصوت يتم تحميله مرة واحدة فقط
    if (!audioRef.current) {
      audioRef.current = new Audio('/notification.mp3');
      // تحميل مسبق للصوت
      audioRef.current.load();
    }
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      // إعادة تعيين الصوت إلى البداية
      audioRef.current.currentTime = 0;
      // محاولة تشغيل الصوت مع معالجة الأخطاء
      audioRef.current.play().catch(err => {
        console.warn('Could not play notification sound:', err);
      });
    }
  };

  return playSound;
}