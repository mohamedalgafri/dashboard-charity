// app/(protected)/admin/donations/page.tsx
import { db } from "@/lib/db";
import { DonationsWrapper } from "@/components/donations/donations-wrapper";

export default async function DonationsPage() {
  const donations = await db.donation.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      donor: true,
      project: true,
    },
  });


  await db.donation.updateMany({
    where: { isRead: false },
    data: { isRead: true }
  });
 
  return <DonationsWrapper donations={donations} />;
}