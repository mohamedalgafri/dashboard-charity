"use server";

import { db } from "@/lib/db";
import { ContactSchema, ContactType } from "@/types/form-types";
import { pusherServer } from "@/lib/pusher";
import { revalidatePath } from "next/cache";
import { z } from "zod";


export async function createContact(data: ContactType) {
  try {
    const validatedData = ContactSchema.parse(data);
    
    const contact = await db.contact.create({
      data: {
        ...validatedData,
        isRead: false
      }
    });

    // إرسال إشعار عبر Pusher
    try {
      const eventData = {
        contact: {
          id: contact.id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          subject: contact.subject,
          message: contact.message,
          isRead: contact.isRead,
          createdAt: contact.createdAt
        }
      };
      
      await pusherServer.trigger(
        "contacts-channel", 
        "new-contact", 
        eventData
      );
    } catch (error) {
      console.error("[Server] Pusher Error:", error);
    }

    revalidatePath("/admin/contacts");
    return { success: true, message: "تم إرسال رسالتك بنجاح" };
  } catch (error) {
    console.error("[Server] Error in createContact:", error);
    if (error instanceof z.ZodError) {
      return { success: false, message: "بيانات غير صحيحة" };
    }
    return { success: false, message: "حدث خطأ أثناء إرسال الرسالة" };
  }
}

export async function getContacts() {
  try {
    return await db.contact.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw new Error("فشل في جلب الرسائل");
  }
}

export async function getUnreadContacts() {
  try {
    const contacts = await db.contact.findMany({
      where: { isRead: false },
      orderBy: { createdAt: "desc" }
    });
    return contacts;
  } catch (error) {
    return [];
  }
}

export async function markAllContactsAsRead() {
  try {
    await db.contact.updateMany({
      where: { isRead: false },
      data: { isRead: true }
    });
    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}