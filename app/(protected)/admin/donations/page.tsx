// app/(protected)/admin/donations/page.tsx
import { columns } from "./columns";
import { DataTable } from "../pages/data-table";
import { db } from "@/lib/db";

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">التبرعات</h1>
      </div>

      <DataTable columns={columns} data={donations} />
    </div>
  );
}