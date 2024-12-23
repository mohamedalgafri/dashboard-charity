"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Trash, Plus, Loader2 } from "lucide-react";
import { updateSocialLinks } from "@/actions/settings";
import { Card } from "@/components/ui/card";

const socialLinkSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  icon: z.string(),
});

const socialLinksSchema = z.object({
  links: z.array(socialLinkSchema),
});

type FormData = z.infer<typeof socialLinksSchema>;

export function SocialLinksForm({ settings }) {
  const [isPending, startTransition] = useTransition();
  const [updated, setUpdated] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      links: settings?.socialLinks || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "links",
  });

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const result = await updateSocialLinks(data.links);

      if (result.error) {
        toast.error("حدث خطأ", {
          description: result.error,
        });
      } else {
        setUpdated(false);
        
        toast.success("تم تحديث روابط التواصل بنجاح");
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <SectionColumns
        title="روابط التواصل الاجتماعي"
        description="إضافة وتعديل روابط مواقع التواصل الاجتماعي"
      >
        <div className="flex items-center gap-2 mb-2">
            <p>ملاحظة : اختر الايقونات من هاذا الموقع </p>
            <a target="_blank" href="https://lucide.dev/icons">lucide</a>
        </div>
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 inline-block">اسم الموقع التواصل الاجتماعي</Label>
                    <Input
                      {...register(`links.${index}.name`)}
                      onChange={() => setUpdated(true)}
                    />
                    {errors?.links?.[index]?.name && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.links[index].name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="mb-2 inline-block">الأيقونة</Label>
                    <Input
                      {...register(`links.${index}.icon`)}
                      onChange={() => setUpdated(true)}
                      placeholder="<Instagram />"
                    />
                  </div>
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label className="mb-2 inline-block">الرابط</Label>
                    <Input
                      {...register(`links.${index}.url`)}
                      onChange={() => setUpdated(true)}
                    />
                    {errors?.links?.[index]?.url && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.links[index].url.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => append({ name: "", url: "", icon: "" })}
          >
            <Plus className="h-4 w-4 mr-2" />
            إضافة رابط جديد
          </Button>

          <Button
            type="submit"
            disabled={isPending || !updated}
            className="w-full md:w-auto"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : "حفظ التغييرات"}
          </Button>
        </div>
      </SectionColumns>
    </form>
  );
}