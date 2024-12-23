
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { PageFormProps } from "@/types/form-types";

export function BasicInfoSection({ form, isLoading }: PageFormProps) {
  const { register,setValue,watch, formState: { errors } } = form;
  return (
    <div className="space-y-6 rounded-lg">
      <h3 className="text-lg font-semibold">المعلومات الأساسية</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">عنوان الصفحة *</label>
        <Input {...register("title")} placeholder="أدخل عنوان الصفحة" disabled={isLoading} />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">وصف الصفحة</label>
        <Textarea {...register("description")} placeholder="أدخل وصف الصفحة" disabled={isLoading} />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="isPublished"
          checked={watch("isPublished")}
          onCheckedChange={(checked) => setValue("isPublished", checked)}
          {...register("isPublished")}
        />
        <label htmlFor="isPublished" className="text-sm font-medium">
          نشر الصفحة
        </label>
      </div>
    </div>
  );
}


