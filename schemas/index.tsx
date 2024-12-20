import { UserRole } from "@prisma/client";
import * as z from "zod";
import { LAYOUT_TYPES } from "@/types/form-types";

export const PageFormSchema = z.object({
    title: z.string().min(1, "عنوان الصفحة مطلوب"),
    description: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    headerTitle: z.string().optional(),
    headerDescription: z.string().optional(),
    showHeader: z.boolean().optional().default(false),
    isPublished: z.boolean().optional().default(false),
    sections: z.array(z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      contentType: z.enum(["editor", "html"]).default("editor"),
      layoutType: z.enum(LAYOUT_TYPES).optional(),
      image: z.string().optional(),
      imageFile: z.any().optional(), // إضافة هذا الحقل
      isVisible: z.boolean().optional().default(true),
      showBgColor: z.boolean().optional().default(false),
      bgColor: z.string().optional(),
      order: z.number().optional(),
      inputs: z.array(z.object({
        label: z.string(),
        type: z.string(),
        value: z.string().optional(),
      })).optional(),
    })).optional(),
  });

export const SettingSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.USER,UserRole.ADMIN]),
    email:z.optional((z.string()).email()),
    password: z.optional(z.string().min(6)),
    newPassword:z.optional(z.string().min(6))
}).refine((data)=>{
    if(data.newPassword && !data.password){
        return false;
    }
    return true;
},{
    message:"Password is required!",
    path:["password"]
}).refine((data)=>{
    if(data.password && !data.newPassword){
        return false;
    }
    return true;
},{
    message:"New Password is required!",
    path:["newPassword"]
})

;

export const NewPasswordSchema = z.object({
    password:z.string().min(6,{
        message:"Minimum 6 characters required"
    }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message:"Email is required"
    }),
});


export const LoginSchema = z.object({
    email: z.string().email({
        message:"Email is required"
    }),
    password:z.string().min(1,{
        message:"Password is required"
    }),
    code:z.optional(z.string())
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message:"Email is required"
    }),
    password:z.string().min(6,{
        message:"Minimum 6 characters required"
    }),
    name:z.string().min(1,{
        message:"Name is required"
    }),
});

