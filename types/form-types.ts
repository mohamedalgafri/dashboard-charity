import { z } from "zod";
import { PageFormSchema } from "@/schemas";
import { UseFormReturn } from "react-hook-form";

export const LAYOUT_TYPES = [
    "text-only",
    "text-image",
    "image-text",
    "text-below-image",
    "image-below-text",
  ] as const;
  
  export type LayoutType = typeof LAYOUT_TYPES[number];
  
  export interface Section {
    title?: string;
    content?: string;
    contentType: "editor" | "html";
    layoutType?: LayoutType;
    image?: string;
    imageFile?: File; 
    isVisible?: boolean;
    showBgColor?: boolean;
    bgColor?: string;
    order?: number;
    inputs?: Array<{
      label: string;
      type: string;
      value?: string;
    }>;
  }


  export interface Page {
    title: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    headerTitle?: string;
    headerDescription?: string;
    showHeader?: boolean;
    isPublished?: boolean;
    sections?: Section[];
  }
  

export type FormSchema = z.infer<typeof PageFormSchema>;

export interface PageFormProps {
  form: UseFormReturn<FormSchema>;
  isLoading?: boolean;
}



export interface ProjectFormData {
  title: string;
  description?: string;
  content?: string;
  targetAmount?: number;
  startDate?: string | Date;
  endDate?: string | Date | null;
  coverImage?: string;
  images?: {
      url: string;
      publicId: string;
  }[];
  isPublished: boolean;
}

export const ContactSchema = z.object({
  name: z.string().min(2, { message: "الاسم يجب أن يكون أكثر من حرفين" }),
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح" }),
  phone: z.string().min(10, { message: "رقم الهاتف غير صحيح" }),
  subject: z.string().min(2, { message: "الموضوع يجب أن يكون أكثر من 2 أحرف" }),
  message: z.string().min(10, { message: "الرسالة يجب أن تكون أكثر من 10 أحرف" }),
});

export type ContactType = z.infer<typeof ContactSchema>;