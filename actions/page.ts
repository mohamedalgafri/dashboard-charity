"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSlug } from "@/utils/slugify";

const InputSchema = z.object({
  label: z.string().optional(),
  type: z.string().optional(),
  value: z.string().optional(),
  isRequired: z.boolean().optional(),
});

const SectionSchema = z.object({
  title: z.string().optional(),
  layoutType: z.enum(["text-only", "text-image", "image-text", "text-below-image", "image-below-text"]).optional(),
  contentType: z.enum(["editor", "html"]).optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  order: z.number().optional(),
  isVisible: z.boolean().optional(),
  showBgColor: z.boolean().optional(),
  bgColor: z.string().optional(),
  inputs: z.array(InputSchema).optional(),
});

const AddPageSchema = z.object({
  title: z.string().min(1, "عنوان الصفحة مطلوب"),
  description: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  headerTitle: z.string().optional(),
  headerDescription: z.string().optional(),
  showHeader: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sections: z.array(SectionSchema).optional(),
});

export async function AddPage(data: z.infer<typeof AddPageSchema>) {
  try {
    const validatedData = AddPageSchema.parse(data);
     const slug = createSlug(data.title);

    const page = await db.page.create({
      data: {
        title: validatedData.title,
        slug: slug,
        description: validatedData.description,
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        headerTitle: validatedData.headerTitle,
        headerDescription: validatedData.headerDescription,
        showHeader: validatedData.showHeader ?? false,
        isPublished: validatedData.isPublished ?? false,
        sections: {
          create: validatedData.sections?.map((section, index) => ({
            title: section.title,
            layoutType: section.layoutType,  // إضافة هذا
            order: index,
            isVisible: section.isVisible ?? true,
            showBgColor: section.showBgColor ?? false,
            bgColor: section.bgColor,
            inputs: {
              create: [
                {
                  label: "content",
                  type: section.contentType || "editor",
                  value: section.content || "",
                },
                ...(section.image
                  ? [{
                      label: "image",
                      type: "image",
                      value: section.image,
                    }]
                  : []
                ),
              ]
            },
          })) || [],
        },
      },
      include: {
        sections: {
          include: {
            inputs: true,
          },
        },
      },
    });

    revalidatePath("/");
    return { success: true, page, message: "تم إنشاء الصفحة بنجاح" };
  } catch (error) {
    console.error("خطأ في إنشاء الصفحة:", error);
    return {
      success: false,
      error: String(error),
      message: "فشل في إنشاء الصفحة",
    };
  }
}

export async function updatePage(pageId: number, data: z.infer<typeof AddPageSchema>) {
  try {
    const validatedData = AddPageSchema.parse(data);

    // حذف الأقسام القديمة
    await db.section.deleteMany({
      where: { pageId }
    });

    // تحديث الصفحة مع الأقسام الجديدة
    const page = await db.page.update({
      where: { id: pageId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        metaTitle: validatedData.metaTitle,
        metaDescription: validatedData.metaDescription,
        headerTitle: validatedData.headerTitle,
        headerDescription: validatedData.headerDescription,
        showHeader: validatedData.showHeader ?? false,
        isPublished: validatedData.isPublished ?? false,
        sections: {
          create: validatedData.sections?.map((section, index) => ({
            title: section.title,
            layoutType: section.layoutType,
            order: index,
            isVisible: section.isVisible ?? true,
            showBgColor: section.showBgColor ?? false,
            bgColor: section.bgColor,
            inputs: {
              create: [
                {
                  label: "content",
                  type: section.contentType || "editor",
                  value: section.content || "",
                },
                ...(section.image ? [{
                  label: "image",
                  type: "image",
                  value: section.image,
                }] : []),
              ]
            },
          })) || [],
        },
      },
      include: {
        sections: {
          include: {
            inputs: true,
          },
        },
      },
    });

    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);
    
    return { success: true, page, message: "تم تحديث الصفحة بنجاح" };
  } catch (error) {
    console.error("Error updating page:", error);
    return {
      success: false,
      error: String(error),
      message: "فشل في تحديث الصفحة",
    };
  }
}


export async function updatePagePublishStatus(pageId: number, isPublished: boolean) {
  try {
    // تحديث حالة النشر
    const page = await db.page.update({
      where: { id: pageId },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null
      },
    });

    // تحديث الصفحة في الواجهة
    revalidatePath("/admin/pages");
    revalidatePath(`/${page.slug}`);

    return { 
      success: true, 
      message: `تم ${isPublished ? 'نشر' : 'إلغاء نشر'} الصفحة بنجاح`
    };
  } catch (error) {
    console.error("خطأ في تحديث حالة النشر:", error);
    return {
      success: false,
      error: String(error),
      message: "فشل في تحديث حالة النشر"
    };
  }
}

export async function deletePage(pageId: number) {
  try {
    // حذف كل الأقسام والمدخلات المرتبطة بالصفحة
    await db.section.deleteMany({
      where: { pageId }
    });

    // حذف الصفحة
    const page = await db.page.delete({
      where: { id: pageId }
    });

    // تحديث الواجهة
    revalidatePath("/admin/pages");
    
    return { 
      success: true, 
      message: "تم حذف الصفحة بنجاح"
    };
  } catch (error) {
    console.error("خطأ في حذف الصفحة:", error);
    return {
      success: false,
      error: String(error),
      message: "فشل في حذف الصفحة"
    };
  }
}