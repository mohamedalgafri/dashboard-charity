"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PagePreview } from "@/components/PagePreview";
import type { FormSchema } from "@/types/form-types";
import { useState } from "react";
import { BasicInfoSection } from "./BasicInfoSection";
import { SectionsContainer } from "./SectionsContainer";
import { HeaderSection } from "./HeaderSection";
import { SEOSection } from "./SEOSection";
import { PageFormSchema } from "@/schemas";

interface PageFormProps {
  initialData?: any;
  onSubmit: (data: FormSchema) => Promise<void>;
  mode: "create" | "edit";
}

export default function PageForm({ initialData, onSubmit, mode }: PageFormProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(PageFormSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      showHeader: false,
      headerTitle: "",
      headerDescription: "",
      isPublished: true,
      sections: []
    }
  });

  const { watch, reset, handleSubmit } = form;
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: FormSchema) => {
    if (isLoading) return; // منع الضغط المتكرر
    setIsLoading(true);

    try {
      const processedData = { ...data };

      if (processedData.sections) {
        const updatedSections = await Promise.all(
          processedData.sections.map(async (section) => {
            const processedSection = { ...section };

            if (section.imageFile instanceof File) {
              try {
                const formData = new FormData();
                formData.append('file', section.imageFile);
                formData.append('path', 'pages');

                const response = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData,
                });

                const result = await response.json();
                if (result.secure_url) {
                  processedSection.image = result.secure_url;
                }
              } catch (error) {
                console.error('Error uploading image:', error);
              }
            }

            delete processedSection.imageFile;
            
            if (processedSection.image?.startsWith('blob:')) {
              processedSection.image = '';
            }

            return {
              ...processedSection,
              order: processedSection.order || 0,
              isVisible: processedSection.isVisible ?? true,
              showBgColor: processedSection.showBgColor ?? false,
              contentType: processedSection.contentType || "editor",
              layoutType: processedSection.layoutType || "text-only",
            };
          })
        );

        processedData.sections = updatedSections;
      }

      await onSubmit(processedData);

      if (mode === "create") {
        reset();
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error("حدث خطأ أثناء حفظ الصفحة");
    } finally {
      setIsLoading(false);
    }
  };

  const previewData = {
    ...watch(),
    sections: watch('sections')?.map((section: any) => ({
      ...section,
      image: section.image?.startsWith('blob:') ? section.image : section.image
    }))
  };

  return (
    <div className="mx-auto w-full">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold ">
            {mode === "create" ? "إنشاء صفحة جديدة" : "تعديل الصفحة"}
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <BasicInfoSection form={form} isLoading={isLoading} />
            <SEOSection form={form} />
            <HeaderSection form={form} />
            <SectionsContainer form={form} isLoading={isLoading} />

            <div className="flex justify-end gap-2 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={isLoading}
              >
                إعادة تعيين
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "جاري الحفظ..." : "حفظ الصفحة"}
              </Button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-semibold mb-6">معاينة الصفحة</h3>
            <div className="rounded-xl p-6">
              <PagePreview data={previewData} isPreview={true} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}