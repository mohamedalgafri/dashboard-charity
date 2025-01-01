'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { pusherClient } from '@/lib/pusher';
import { useAppDispatch } from '@/store/hooks';
import { addNewMessage } from '@/store/slices/notificationsSlice';
import { addContact } from '@/store/slices/contactsSlice';

export function MessagesProvider() {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleNewContact = useCallback((data: any) => {
    console.log("[MessagesProvider] Received new contact:", data);

    // Play sound
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    }

    // Update Redux
    console.log("[MessagesProvider] Dispatching addContact");
    dispatch(addContact(data.contact));
    console.log("[MessagesProvider] Dispatching addNewMessage");
    dispatch(addNewMessage());

    // Show toast
    toast({
      title: "رسالة جديدة!",
      description: (
        <div className="rtl:text-right ltr:text-left">
          <p>من: {data.contact.name}</p>
          <p>الموضوع: {data.contact.subject}</p>
        </div>
      ),
      duration: 5000,
    });
  }, [dispatch, toast]);

  useEffect(() => {
    console.log("[MessagesProvider] Setting up Pusher subscription");
    const channel = pusherClient.subscribe('contacts-channel');
    
    channel.bind('new-contact', handleNewContact);

    return () => {
      console.log("[MessagesProvider] Cleaning up");
      channel.unbind('new-contact', handleNewContact);
      channel.unsubscribe();
    };
  }, [handleNewContact]);

  // Sound setup
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

  return null;
}