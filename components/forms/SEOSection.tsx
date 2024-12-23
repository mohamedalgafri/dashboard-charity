import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { PageFormProps } from "@/types/form-types";
import { useState } from "react";

export function SEOSection({ form }: PageFormProps) {
  const { register } = form;
  const [showSEOSection, setShowSEOSection] = useState(true);

  return (
    <div className="space-y-4 p-4 rounded-lg border">
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <h4 className="font-medium">معلومات SEO</h4>
        <div className="flex  items-center gap-3">
          <Switch
            id="show-seo"
            checked={showSEOSection}
            onCheckedChange={setShowSEOSection}
          />
          <label htmlFor="show-seo" className="text-sm font-medium">
            {showSEOSection ? "إخفاء" : "إظهار"} معلومات SEO
          </label>
        </div>
      </div>

      {showSEOSection && (
        <div className="space-y-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium mb-1">عنوان الميتا</label>
            <Input 
              {...register("metaTitle")} 
              placeholder="سيتم استخدام عنوان الصفحة إذا تُرك فارغاً" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">وصف الميتا</label>
            <Textarea 
              {...register("metaDescription")} 
              placeholder="سيتم استخدام وصف الصفحة إذا تُرك فارغاً" 
            />
          </div>
        </div>
      )}
    </div>
  );
}