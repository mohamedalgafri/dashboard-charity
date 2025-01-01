"use server"

import { z } from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { DonationSchema } from "@/schemas";
import { pusherServer } from "@/lib/pusher";

// جلب جميع التبرعات للجدول
export async function getDonations() {
  try {
    const donations = await db.donation.findMany({
      include: {
        donor: true,
        project: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return donations;
  } catch (error) {
    throw new Error("فشل في جلب التبرعات");
  }
}

// إنشاء تبرع جديد
export async function createDonation(data: z.infer<typeof DonationSchema>) {
  try {
    const validatedData = DonationSchema.parse(data);
    
    const project = await db.project.findUnique({
      where: { id: validatedData.projectId },
      select: {
        id: true,
        slug: true,
        targetAmount: true,
        currentAmount: true,
        title: true,
      }
    });

    if (!project) {
      return {
        success: false,
        message: "الحملة غير موجودة",
      };
    }

    let donor;
    if (validatedData.email || validatedData.phone) {
      donor = await db.donor.findFirst({
        where: {
          OR: [
            { email: validatedData.email || null },
            { phone: validatedData.phone || null }
          ]
        }
      });
    }

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

    const donation = await db.donation.create({
      data: {
        amount: validatedData.amount,
        message: validatedData.message || undefined,
        status: "awaiting_payment",
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

    try {
      await pusherServer.trigger('donations', 'new-donation', {
        donation: {
          id: donation.id,
          amount: donation.amount,
          status: donation.status,
          message: donation.message,
          createdAt: donation.createdAt,
          project: {
            id: donation.project.id,
            title: donation.project.title
          },
          donor: {
            id: donation.donor.id,
            name: donation.donor.anonymous ? 'متبرع مجهول' : donation.donor.name,
            anonymous: donation.donor.anonymous,
            email: donation.donor.email,
            phone: donation.donor.phone
          }
        }
      });
    } catch (pusherError) {
      console.error('Pusher error:', pusherError);
    }

    revalidatePath(`/projects/${project.slug}`);
    revalidatePath('/admin/donations');

    return {
      success: true,
      donation,
      message: "تم إنشاء التبرع بنجاح",
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

// عدد الإشعارات غير المقروءة
export async function getUnreadCounts() {
  try {
    const [donations, messages] = await Promise.all([
      db.donation.count({ where: { isRead: false } }),
      db.contact.count({ where: { isRead: false } })
    ]);
    return { donations, messages };
  } catch (error) {
    console.error("Error getting unread counts:", error);
    return { donations: 0, messages: 0 };
  }
}

// جلب التبرعات غير المقروءة للإشعارات
export async function getUnreadDonations() {
  try {
    const donations = await db.donation.findMany({
      where: { isRead: false },
      include: {
        donor: true,
        project: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return donations;
  } catch (error) {
    return [];
  }
}

// تعليم جميع التبرعات كمقروءة
export async function markAllDonationsAsRead() {
  try {
    await db.donation.updateMany({
      where: { isRead: false },
      data: { isRead: true }
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}