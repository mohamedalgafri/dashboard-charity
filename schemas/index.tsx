import { UserRole } from "@prisma/client";
import * as z from "zod";

;

export const projectSchema = z.object({
  title: z.string().min(1, { message: "عنوان الحملة مطلوب" }),
  description: z.string().optional(),
  targetAmount: z.number({ 
    required_error: "المبلغ المستهدف مطلوب",
    invalid_type_error: "يجب أن يكون المبلغ رقماً"
  }).min(0.01, { message: "يجب أن يكون المبلغ أكبر من صفر" }), // تعديل هنا
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  content: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;


export const PageFormSchema = z.object({
  title: z.string().min(1, "عنوان الصفحة مطلوب"),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  headerTitle: z.string().optional(),
  headerDescription: z.string().optional(),
  showHeader: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sections: z.array(
    z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      contentType: z.enum(["editor", "html"]).default("editor"),
      layoutType: z.enum([
        "text-only",
        "text-image",
        "image-text",
        "text-below-image",
        "image-below-text"
      ]).default("text-only"),
      image: z.any().optional(), // تعديل هنا
      imageFile: z.any().optional(), // إضافة هذا
      isVisible: z.boolean().default(true),
      showBgColor: z.boolean().default(false),
      bgColor: z.string().optional(),
      order: z.number().default(0),
      inputs: z.array(z.any()).optional()
    })
  ).default([])
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


export const DonationSchema = z.object({
  projectId: z.coerce.number({
    required_error: "اختيار الحملة مطلوب",
    invalid_type_error: "يجب أن يكون رقماً",
  }).positive("اختيار الحملة مطلوب"),

  amount: z.coerce
    .number({
      required_error: "قيمة التبرع مطلوبة",
      invalid_type_error: "يجب أن يكون رقماً",
    })
    .positive("يجب أن تكون قيمة التبرع أكبر من صفر")
    .min(1, "الحد الأدنى للتبرع هو 1")
    .max(1000000, "قيمة التبرع تجاوزت الحد المسموح به"),

  donorName: z.string({
    required_error: "الاسم مطلوب",
  }).min(2, "الاسم يجب أن يكون على الأقل حرفين"),

  email: z.string({
    required_error: "البريد الإلكتروني مطلوب",
  }).email("البريد الإلكتروني غير صالح"),

  phone: z.string({
    required_error: "رقم الهاتف مطلوب",
  })
    .min(9, "رقم الهاتف غير صالح")
    .max(15, "رقم الهاتف غير صالح")
    .regex(/^[0-9+]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),

  message: z.string().optional(),
  anonymous: z.boolean().default(false),
});

export type DonationType = z.infer<typeof DonationSchema>;

export const LoginSchema = z.object({
    email: z.string().email({
        message:"Email is required"
    }),
    password:z.string().min(1,{
        message:"Password is required"
    }),
    code:z.optional(z.string())
});

