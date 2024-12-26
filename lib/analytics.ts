import { db } from "@/lib/db";

export async function getDashboardStats() {
    try {
        const projectsCount = await db.project.count();
        const donorsCount = await db.donor.count();
        
        const completedProjectsCount = await db.project.findMany({
            where: {
                targetAmount: { not: null },
                donations: {
                    some: {
                        status: "completed"
                    }
                }
            },
            include: {
                donations: {
                    where: {
                        status: "completed"
                    },
                    select: {
                        amount: true
                    }
                }
            }
        }).then(projects => {
            return projects.filter(project => 
                project.donations.reduce((sum, donation) => 
                    sum + (Number(donation.amount) || 0), 0) >= (project.targetAmount as number)
            ).length;
        });

        const totalDonations = await db.donation.aggregate({
            where: { status: "completed" },
            _sum: { amount: true }
        });

        return {
            projectsCount,
            donorsCount,
            completedProjectsCount,
            totalDonations: Number(totalDonations._sum.amount || 0),
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw error;
    }
}