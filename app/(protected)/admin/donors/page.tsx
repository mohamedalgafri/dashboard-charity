// app/(protected)/admin/donors/page.tsx
import { columns } from "./columns";
import { DataTable } from "../pages/data-table";
import { db } from "@/lib/db";

export default async function DonorsPage() {
  const donors = await db.donor.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          donations: true
        }
      }
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">المتبرعين</h1>
      </div>

      <DataTable columns={columns} data={donors} />
    </div>
  );
}