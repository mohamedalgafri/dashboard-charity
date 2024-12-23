"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { useUpload } from "@/hooks/useUpload";
import { updateSiteSettings } from "@/actions/settings";
import { ImageUploader } from "./ImageUploader";

const siteSettingsSchema = z.object({
  siteName: z.string().min(1).max(50),
  logoImage: z.string().optional(),
  logoText: z.string().optional(),
});

type FormData = z.infer<typeof siteSettingsSchema>;

export function SiteSettingsForm({ settings }) {
  const [isPending, startTransition] = useTransition();
  const [updated, setUpdated] = useState(false);
  const [logoImage, setLogoImage] = useState({
    preview: settings?.logoImage || '',
    file: null
  });
  const { uploadFile, isUploading } = useUpload();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: settings?.siteName || "",
      logoImage: settings?.logoImage || "",
      logoText: settings?.logoText || "",
    },
  });

  const handleLogoImageChange = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      setLogoImage({
        preview,
        file
      });
      setUpdated(true);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    startTransition(async () => {
      try {
        let logoUrl = logoImage.preview;
        
        if (logoImage.file) {
          const uploadResult = await uploadFile(logoImage.file);
          if (uploadResult) {
            logoUrl = uploadResult.url;
          }
        }

        const result = await updateSiteSettings({
          ...data,
          logoImage: logoUrl
        });

        if (result.error) {
          toast.error("حدث خطأ", {
            description: result.error,
          });
        } else {
          setUpdated(false);
          toast.success("تم تحديث الإعدادات بنجاح");
        }
      } catch (error) {
        toast.error("حدث خطأ أثناء تحديث الإعدادات");
      }
    });
  });

  return (
    <form onSubmit={onSubmit} className="mt-8">
      <SectionColumns
        title="إعدادات الموقع"
        description="تعديل اسم الموقع والشعار"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="siteName">اسم الموقع</Label>
            <Input
              id="siteName"
              className="mt-2"
              {...register("siteName")}
              onChange={(e) => setUpdated(true)}
            />
            {errors?.siteName && (
              <p className="text-red-600 text-sm mt-1">{errors.siteName.message}</p>
            )}
          </div>
          
          <div>
            <Label>صورة الشعار</Label>
            <div className="mt-2">
              <ImageUploader
                onImagesChange={handleLogoImageChange}
                previewImages={logoImage.preview ? [logoImage.preview] : []}
                onRemoveImage={() => {
                  setLogoImage({ preview: '', file: null });
                  setValue('logoImage', '');
                  setUpdated(true);
                }}
                disabled={isPending}
                maxImages={1}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="logoText">نص الشعار</Label>
            <Input
              id="logoText"
              className="mt-2"
              {...register("logoText")}
              onChange={(e) => setUpdated(true)}
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || isUploading || !updated}
            className="w-full md:w-auto"
          >
            {(isPending || isUploading) ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : "حفظ التغييرات"}
          </Button>
        </div>
      </SectionColumns>
    </form>
  );
}