// actions/contact.ts
"use server";


import { db } from "@/lib/db";
import { ContactSchema, ContactType } from "@/types/form-types";

import { z } from "zod";

export async function createContact(data: ContactType) {
  try {
    const validatedData = ContactSchema.parse(data);
    
    const contact = await db.contact.create({
      data: validatedData,
    });

    return { success: true, message: "تم إرسال رسالتك بنجاح" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "بيانات غير صحيحة", errors: error.errors };
    }
    
    return { success: false, message: "حدث خطأ أثناء إرسال الرسالة" };
  }
}