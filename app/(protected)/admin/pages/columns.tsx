"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { updatePagePublishStatus } from "@/actions/page";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "العنوان",
  },
  {
    accessorKey: "slug",
    header: "الرابط",
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },
  {
    accessorKey: "isPublished",
    header: "منشور",
    cell: ({ row }) => {
      const page = row.original;
      
      return (
        <Switch
          checked={page.isPublished}
          onCheckedChange={async (checked) => {
            const result = await updatePagePublishStatus(page.id, checked);
            if (result.success) {
              toast.success(result.message);
            } else {
              toast.error(result.message);
            }
          }}
        />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const page = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link href={`/admin/pages/${page.id}/edit`}>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              تعديل
            </Button>
          </Link>
          <Link href={`/${page.slug}`} target="_blank">
            <Button size="sm" variant="ghost">
              <Eye className="h-4 w-4 mr-2" />
              معاينة
            </Button>
          </Link>
        </div>
      );
    },
  },
];