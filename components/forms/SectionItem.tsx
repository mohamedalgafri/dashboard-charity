"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextEditor } from "@/components/forms/TextEditor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUpload } from "@/hooks/useUpload";
import Image from "next/image";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SectionItemProps {
  index: number;
  form: any;
  onRemove: () => void;
  isLoading: boolean;
}

export function SectionItem({ index, form, onRemove, isLoading }: SectionItemProps) {
  const { register, setValue, getValues } = form;
  const { uploadFile, isUploading } = useUpload({
    path: 'pages',
    maxSize: 5,
    acceptedTypes: ['image/jpeg', 'image/png', 'image/webp']
  });

  const currentImage = getValues(`sections.${index}.image`);
  const [imagePreview, setImagePreview] = useState<string | null>(currentImage || null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // إنشاء معاينة مؤقتة فقط
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // حفظ الملف والمعاينة في النموذج
      setValue(`sections.${index}`, {
        ...getValues(`sections.${index}`),
        image: previewUrl,
        imageFile: file // نحتفظ بالملف للرفع لاحقاً
      }, { 
        shouldValidate: true,
        shouldDirty: true 
      });
    } catch (error) {
      console.error("Error handling image:", error);
      toast.error("حدث خطأ في معالجة الصورة");
    }
  };

  
  const handleRemoveImage = () => {
    setValue(`sections.${index}.image`, null, {
      shouldValidate: true,
      shouldDirty: true
    });
    setImagePreview(null);
  };

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {getValues(`sections.${index}.title`) || `القسم ${index + 1}`}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Switch
              checked={getValues(`sections.${index}.isVisible`)}
              onCheckedChange={(value) =>
                setValue(`sections.${index}.isVisible`, value)
              }
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onRemove}
              disabled={isLoading}
            >
              حذف
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex flex-col gap-2">
            <label>عنوان القسم</label>
            <Input
              {...register(`sections.${index}.title`)}
              placeholder="عنوان القسم"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>نوع التنسيق</label>
            <Select
              value={getValues(`sections.${index}.layoutType`)}
              onValueChange={(value) =>
                setValue(`sections.${index}.layoutType`, value)
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع التنسيق" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text-only">نص فقط</SelectItem>
                <SelectItem value="text-image">نص وصورة</SelectItem>
                <SelectItem value="image-text">صورة ونص</SelectItem>
                <SelectItem value="text-below-image">نص تحت الصورة</SelectItem>
                <SelectItem value="image-below-text">صورة تحت النص</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {getValues(`sections.${index}.layoutType`) !== 'text-only' && (
            <div className="flex flex-col gap-2">
              <label>الصورة</label>
              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading || isUploading}
                  className="hidden"
                  id={`section-image-${index}`}
                />
                {imagePreview ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                      disabled={isLoading}
                    >
                      حذف
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor={`section-image-${index}`}
                    className="flex aspect-video w-full cursor-pointer items-center justify-center rounded-lg border border-dashed"
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        جاري الرفع...
                      </div>
                    ) : (
                      <span>انقر لإضافة صورة</span>
                    )}
                  </label>
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label>المحتوى</label>
            <TextEditor
              value={getValues(`sections.${index}.content`)}
              onChange={(content) =>
                setValue(`sections.${index}.content`, content)
              }
            />
          </div>

          <div className="flex items-center gap-4">
            <label>لون الخلفية</label>
            <div className="flex items-center gap-2">
              <Switch
                checked={getValues(`sections.${index}.showBgColor`)}
                onCheckedChange={(value) =>
                  setValue(`sections.${index}.showBgColor`, value)
                }
                disabled={isLoading}
              />
              {getValues(`sections.${index}.showBgColor`) && (
                <Input
                  type="color"
                  {...register(`sections.${index}.bgColor`)}
                  className="w-24"
                  disabled={isLoading}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}