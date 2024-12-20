// app/(protected)/admin/projects/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Project } from "@prisma/client";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { ProgressBar } from "./ProgressBar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Eye, Trash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "title",
    header: "عنوان المشروع",
    cell: ({ row }) => {
      const title: string = row.getValue("title");
      return (
        <div className="flex items-center space-x-2 space-x-reverse">
          {row.original.coverImage && (
            <Image
              src={row.original.coverImage}
              alt={title}
              className="size-10 rounded-md object-cover"
              width='10'
              height='10'
            />
          )}
          <span className="font-medium">{title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "currentAmount",
    header: "التقدم",
    cell: ({ row }) => {
      const currentAmount = row.original.currentAmount;
      const targetAmount = row.original.targetAmount || 0;
      return (
        <div className="w-48">
          <ProgressBar
            currentAmount={currentAmount}
            targetAmount={targetAmount}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: "الحالة",
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished");
      return (
        <Badge variant={isPublished ? "success" : "secondary"}>
          {isPublished ? "منشور" : "مسودة"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإنشاء",
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "dd MMMM yyyy", {
        locale: ar,
      });
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">فتح القائمة</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/projects/${project.id}`}>
                <Pencil className="ml-2 h-4 w-4" />
                <span>تعديل</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/projects/${project.slug}`} target="_blank">
                <Eye className="ml-2 h-4 w-4" />
                <span>عرض</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash className="ml-2 h-4 w-4" />
              <span>حذف</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];