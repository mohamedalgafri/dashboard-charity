'use client';

import { useEffect, useCallback } from "react";
import { columns } from "./columns";
import { DataTable } from "../pages/data-table";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchContacts, addContact } from "@/store/slices/contactsSlice";
import { resetUnreadMessages } from "@/store/slices/notificationsSlice";
import { markAllContactsAsRead } from "@/actions/contact";
import TableLoading from "./loading";
import { pusherClient } from "@/lib/pusher";

export default function ContactsPage() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.contacts);

  const handleNewContact = useCallback((data: any) => {
    dispatch(addContact(data.contact));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchContacts());

    const markAsRead = async () => {
      await markAllContactsAsRead();
      dispatch(resetUnreadMessages());
    };
    markAsRead();

    // Subscribe to Pusher
    const channel = pusherClient.subscribe('contacts-channel');
    
    // Bind events
    channel.bind('new-contact', handleNewContact);

    return () => {
      console.log("[ContactsPage] Cleaning up");
      channel.unbind('new-contact', handleNewContact);
      channel.unsubscribe();
    };
  }, [dispatch, handleNewContact]);

  if (error) return <div>حدث خطأ: {error}</div>;
  if (isLoading || items.length === 0) return <TableLoading />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">رسائل التواصل</h1>
      </div>
      <DataTable columns={columns} data={items} />
    </div>
  );
}