"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { updatePagePublishStatus, deletePage } from "@/actions/page";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface CellActionsProps {
  page: any;
}

const CellActions = ({ page }: CellActionsProps) => {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deletePage(page.id);
      
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف الصفحة");
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Link href={`/admin/pages/${page.id}/edit`}>
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4 ml-2" />
            تعديل
          </Button>
        </Link>
        <Link href={`/${page.slug}`} target="_blank">
          <Button size="sm" variant="ghost">
            <Eye className="h-4 w-4 ml-2" />
            معاينة
          </Button>
        </Link>
        <Button 
          size="sm" 
          variant="destructive"
          onClick={() => setShowDeleteAlert(true)}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4 ml-2" />
          )}
          حذف
        </Button>
      </div>

      <AlertDialog 
        open={showDeleteAlert} 
        onOpenChange={isDeleting ? undefined : setShowDeleteAlert}
      >
        <AlertDialogContent onInteractOutside={e => {
          if (isDeleting) {
            e.preventDefault();
          }
        }}>
          <AlertDialogHeader className="w-full">
            <AlertDialogTitle>تأكيد حذف الصفحة</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف صفحة {page.title}
              <br />
              سيتم حذف جميع البيانات المرتبطة بها ولا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className=" gap-2">
            <AlertDialogCancel disabled={isDeleting}>
              إلغاء
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="ml-2 size-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                "تأكيد الحذف"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

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
    cell: ({ row }) => <CellActions page={row.original} />
  },
];