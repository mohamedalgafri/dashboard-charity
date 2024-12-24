"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Project } from "@prisma/client";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Pencil, Eye, Trash, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Link from "next/link";
import Image from "next/image";
import DonationProgress from "@/components/content/DonationProgress";
import { deleteProject } from "@/actions/project";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CellActionProps {
  project: Project;
}

const CellAction = ({ project }: CellActionProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      const result = await deleteProject(project.id);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
        setShowDeleteAlert(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الحملة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={loading}>
            <span className="sr-only">فتح القائمة</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem  className="flex justify-center cursor-pointer" asChild>
            <Link href={`/admin/projects/${project.id}`}>
              <span>تعديل</span>
              <Pencil className="ml-2 h-4 w-4" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-center cursor-pointer" asChild>
            <Link href={`/projects/${project.slug}`} target="_blank">
              <span>عرض</span>
              <Eye className="ml-2 h-4 w-4" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              setShowDeleteAlert(true);
            }}
            className="text-red-600 flex justify-center cursor-pointer"
          >
            <span>حذف</span>
            <Trash className="ml-2 h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={loading ? undefined : setShowDeleteAlert}>
        <AlertDialogContent onInteractOutside={e => {
          if (loading) {
            e.preventDefault();
          }
        }}>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد حذف الحملة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف حملة {project.title}
              <br />
              سيتم حذف جميع البيانات المرتبطة به ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteAlert(false)}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={loading}
              className="gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "جاري الحذف..." : "تأكيد الحذف"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// ... باقي تعريفات الأعمدة تبقى كما هي
export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "title",
    header: "عنوان الحملة",
    cell: ({ row }) => {
      const title: string = row.getValue("title");
      return (
        <div className="flex items-center space-x-2 space-x-reverse">
          {row.original.coverImage && (
            <Image
              src={row.original.coverImage}
              alt={title}
              className="size-10 rounded-md object-cover"
              width={40}
              height={40}
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
          <DonationProgress
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
    cell: ({ row }) => <CellAction project={row.original} />,
  },
];