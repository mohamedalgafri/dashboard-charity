import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PageFormProps } from "@/types/form-types";

export function SEOSection({ form }: PageFormProps) {
  const { register } = form;

  return (
    <div className="space-y-4">
      <h4 className="font-medium">معلومات SEO</h4>
      <div>
        <label className="block text-sm font-medium mb-1">عنوان الميتا</label>
        <Input {...register("metaTitle")} placeholder="سيتم استخدام عنوان الصفحة إذا تُرك فارغاً" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">وصف الميتا</label>
        <Textarea {...register("metaDescription")} placeholder="سيتم استخدام وصف الصفحة إذا تُرك فارغاً" />
      </div>
    </div>
  );
}
