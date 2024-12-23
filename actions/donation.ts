// actions/donation.ts
"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { DonationSchema } from "@/schemas";

export async function createDonation(data: z.infer<typeof DonationSchema>) {
  try {
    const validatedData = DonationSchema.parse(data);

    // التحقق من وجود الحملة
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
        message: "الحملة غير موجود",
      };
    }

    // إنشاء أو العثور على المتبرع
    let donor;
    if (validatedData.email) {
      donor = await db.donor.upsert({
        where: { email: validatedData.email },
        update: {
          name: validatedData.donorName,
          phone: validatedData.phone || undefined,
          anonymous: validatedData.anonymous,
        },
        create: {
          name: validatedData.donorName,
          email: validatedData.email,
          phone: validatedData.phone || undefined,
          anonymous: validatedData.anonymous,
        },
      });
    } else {
      donor = await db.donor.create({
        data: {
          name: validatedData.donorName,
          phone: validatedData.phone || undefined,
          anonymous: validatedData.anonymous,
        },
      });
    }

    const newAmount = project.currentAmount + validatedData.amount;
    const donationStatus = (project.targetAmount && newAmount >= project.targetAmount)
      ? "completed"
      : "pending";

    // إنشاء التبرع
    const donation = await db.donation.create({
      data: {
        amount: validatedData.amount,
        message: validatedData.message || undefined,
        status: donationStatus,
        project: {
          connect: { id: validatedData.projectId } // هنا التغيير
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

    // تحديث المبلغ الحالي للحملة
    await db.project.update({
      where: { id: validatedData.projectId }, // هنا التغيير
      data: {
        currentAmount: {
          increment: validatedData.amount,
        },
      },
    });

    // تحديث حالة التبرعات السابقة
    if (donationStatus === "completed") {
      await db.donation.updateMany({
        where: {
          projectId: validatedData.projectId, // هنا التغيير
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
        message: error.errors[0].message || "بيانات التبرع غير صحيحة",
      };
    }
    return {
      success: false,
      message: "حدث خطأ أثناء إضافة التبرع",
    };
  }
}