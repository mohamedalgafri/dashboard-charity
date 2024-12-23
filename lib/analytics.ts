// lib/analytics.ts
import { db } from "@/lib/db";

export async function getDashboardStats() {
    try {
        // طباعة التبرعات للتحقق
        const allDonations = await db.donation.findMany({
            where: {
                status: "completed"
            },
            select: {
                amount: true
            }
        });
        console.log("All donations:", allDonations);

        // عدد الحملات
        const projectsCount = await db.project.count();

        // عدد المتبرعين الفريدين
        const donorsCount = await db.donor.count();

        // مجموع التبرعات بطريقة بديلة
        const totalDonations = await db.donation.aggregate({
            _sum: {
                amount: true
            }
        });

        // عدد التبرعات المكتملة
        const completedDonationsCount = await db.donation.count({
            where: {
                status: "completed"  // نضيف هذا الشرط
            }
        });


        // عدد التبرعات
        const donationsCount = await db.donation.count();

        return {
            projectsCount,
            donorsCount,
            totalDonations: Number(totalDonations._sum.amount || 0), // استخدام Number للتأكد من التحويل الصحيح
            completedDonationsCount ,
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error; // إظهار الخطأ للتحقق منه
    }
}