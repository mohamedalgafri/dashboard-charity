// actions/donation.ts
"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { DonationSchema } from "@/schemas";
import { pusherServer } from "@/lib/pusher";


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
        message: "الحملة غير موجودة",
      };
    }

    // البحث عن متبرع موجود أو إنشاء متبرع جديد
    let donor;
    if (validatedData.email || validatedData.phone) {
      // البحث عن المتبرع بالإيميل أو رقم الهاتف
      donor = await db.donor.findFirst({
        where: {
          OR: [
            { email: validatedData.email || null },
            { phone: validatedData.phone || null }
          ]
        }
      });
    }

    // إذا لم نجد المتبرع، نقوم بإنشاء متبرع جديد
    if (!donor) {
      donor = await db.donor.create({
        data: {
          name: validatedData.donorName,
          email: validatedData.email || null,
          phone: validatedData.phone || null,
          anonymous: validatedData.anonymous,
        },
      });
    }

    const newAmount = project.currentAmount + validatedData.amount;
    const donationStatus = (project.targetAmount && newAmount >= project.targetAmount)
      ? "completed"
      : "pending";

      const donation = await db.donation.create({
        data: {
          amount: validatedData.amount,
          message: validatedData.message || undefined,
          status: donationStatus,
          isRead: false,
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
  
      // إضافة إرسال الإشعار عبر Pusher
      await pusherServer.trigger('donations', 'new-donation', {
        donation: {
          id: donation.id,
          amount: donation.amount,
          donorName: donation.donor.anonymous ? 'متبرع مجهول' : donation.donor.name,
          projectTitle: donation.project.title,
          createdAt: donation.createdAt
        }
      }).then(() => {
        console.log("Pusher notification sent successfully");
      }).catch((error) => {
        console.error("Error sending Pusher notification:", error);
      });

    // تحديث المبلغ الحالي للحملة
    await db.project.update({
      where: { id: validatedData.projectId },
      data: {
        currentAmount: {
          increment: validatedData.amount,
        },
      },
    });

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