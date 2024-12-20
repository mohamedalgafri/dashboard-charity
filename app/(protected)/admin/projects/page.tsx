// app/(protected)/admin/projects/page.tsx

import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { DataTable } from "../pages/data-table";
import { db } from "@/lib/db";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">إدارة المشاريع</h1>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="ml-2 h-4 w-4" />
            مشروع جديد
          </Link>
        </Button>
      </div>

      <DataTable columns={columns} data={projects} />
    </div>
  );
}