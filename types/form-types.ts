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



