// actions/donation.ts
"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const DonationSchema = z.object({
  projectId: z.number(),
  amount: z.number().min(1, "قيمة التبرع يجب أن تكون أكبر من صفر"),
  donorName: z.string().min(1, "اسم المتبرع مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح").optional().nullable(),
  phone: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  anonymous: z.boolean().default(false),
});

export async function createDonation(data: z.infer<typeof DonationSchema>) {
  try {
    const validatedData = DonationSchema.parse(data);

    // التحقق من وجود المشروع مع جلب المبلغ المستهدف والحالي
    const project = await db.project.findUnique({
      where: { id: validatedData.projectId },
      select: {
        id: true,
        slug: true,
        targetAmount: true,
        currentAmount: true,
      }
    });

    if (!project) {
      return {
        success: false,
        message: "المشروع غير موجود",
      };
    }

    // إنشاء أو العثور على المتبرع
    let donor;

    if (validatedData.email) {
      // البحث عن متبرع موجود بنفس البريد الإلكتروني
      donor = await db.donor.upsert({
        where: { email: validatedData.email },
        update: {
          name: validatedData.donorName,
          phone: validatedData.phone,
          anonymous: validatedData.anonymous,
        },
        create: {
          name: validatedData.donorName,
          email: validatedData.email,
          phone: validatedData.phone,
          anonymous: validatedData.anonymous,
        },
      });
    } else {
      // إنشاء متبرع جديد بدون بريد إلكتروني
      donor = await db.donor.create({
        data: {
          name: validatedData.donorName,
          phone: validatedData.phone,
          anonymous: validatedData.anonymous,
        },
      });
    }

    // حساب المبلغ الجديد للمشروع
    const newAmount = project.currentAmount + validatedData.amount;

    // تحديد حالة التبرع بناءً على اكتمال المبلغ المستهدف
    const donationStatus = (project.targetAmount && newAmount >= project.targetAmount)
      ? "completed"
      : "pending";

    // إنشاء التبرع وربطه بالمتبرع والمشروع
    const donation = await db.donation.create({
      data: {
        amount: validatedData.amount,
        message: validatedData.message,
        status: donationStatus, // تحديث الحالة
        project: {
          connect: { id: validatedData.projectId }
        },
        donor: {
          connect: { id: donor.id }
        }
      },
      include: {
        donor: true,
        project: true
      }
    });

    // تحديث المبلغ الحالي للمشروع
    await db.project.update({
      where: { id: validatedData.projectId },
      data: {
        currentAmount: {
          increment: validatedData.amount,
        },
      },
    });


    if (donationStatus === "completed") {
      await db.donation.updateMany({
        where: {
          projectId: validatedData.projectId,
          status: "pending"
        },
        data: {
          status: "completed"
        }
      });
    }


    revalidatePath(`/projects/${project.slug}`);

    return {
      success: true,
      donation,
      message: "تم إضافة تبرعك بنجاح",
    };
  } catch (error) {
    console.error("خطأ في إنشاء التبرع:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "بيانات التبرع غير صحيحة",
        errors: error.errors,
      };
    }
    return {
      success: false,
      message: "حدث خطأ أثناء إضافة التبرع",
    };
  }
}