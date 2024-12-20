import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { PageFormProps } from "@/types/form-types";

export function HeaderSection({ form }: PageFormProps) {
  const { register, watch, setValue } = form;

  return (
    <div className="space-y-4 p-4 rounded-lg">
      <div className="flex items-center gap-3">
        <Switch
          id="show-header"
          checked={watch("showHeader")}
          onCheckedChange={(checked) => setValue("showHeader", checked)}
        />
        <label htmlFor="show-header" className="text-sm font-medium">
          إظهار الهيدر
        </label>
      </div>

      {watch("showHeader") && (
        <div className="space-y-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium mb-1">عنوان الهيدر</label>
            <Input {...register("headerTitle")} placeholder="سيتم استخدام عنوان الصفحة إذا تُرك فارغاً" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">وصف الهيدر</label>
            <Textarea {...register("headerDescription")} placeholder="وصف يظهر تحت عنوان الهيدر" />
          </div>
        </div>
      )}
    </div>
  );
}
