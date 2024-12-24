// components/project/project-actions.tsx
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Loader2, Trash } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { UseFormRegister } from 'react-hook-form';
import { ProjectFormValues } from '@/schemas/project-schema';

interface ProjectActionsProps {
  register: UseFormRegister<ProjectFormValues>;
  isEditing: boolean;
  loading: boolean;
  deleteLoading: boolean;
  setValue;
  onDelete: () => Promise<void>;
}

export function ProjectActions({ register, isEditing, loading,setValue , deleteLoading, onDelete }: ProjectActionsProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            isEditing ? "تحديث الحملة" : "حفظ الحملة"
          )}
        </Button>

        <div className="flex items-center gap-2">
          <Switch
            id="isPublished"
            {...register("isPublished")}
            disabled={loading}
            onCheckedChange={(checked) => {
              setValue("isPublished", checked);
            }}
          />
          <Label htmlFor="isPublished">نشر الحملة</Label>
        </div>
      </div>

      {isEditing && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="destructive"
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" />
                  حذف الحملة
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تأكيد حذف الحملة</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من حذف هذه الحملة؟ هذا الإجراء لا يمكن التراجع عنه.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                تأكيد الحذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}