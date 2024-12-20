import { db } from "@/lib/db";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default async function PagesPage() {
  const pages = await db.page.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={pages} />
    </div>
  );
}