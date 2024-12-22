import { db } from "@/lib/db";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function PagesPage() {
  const pages = await db.page.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h1 className="text-xl font-bold">إدارة الصفحات</h1>
      <Button>
        <Link className="flex gap-1 items-center" href="/admin/pages/create-page">
          <Plus className="mr-2 size-4" />
          <span>إنشاء صفحة</span>
        </Link>
      </Button>
    </div>

    <DataTable columns={columns} data={pages} />
  </div>

  );
}