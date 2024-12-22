// components/forms/PageForm.tsx
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
        headerTitle:"",
        headerDescription: "",
        isPublished: true,
        sections: [],
      },
    });

  const { watch, reset, handleSubmit } = form;
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: FormSchema) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      if (mode === "create") {
        reset();
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full p-8">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">
            {mode === "create" ? "إنشاء صفحة جديدة" : "تعديل الصفحة"}
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <BasicInfoSection form={form} isLoading={isLoading} />
            <SEOSection form={form} />
            <HeaderSection form={form} />
            <SectionsContainer form={form} isLoading={isLoading} />

            {/* أزرار التحكم */}
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

          {/* معاينة الصفحة */}
          <div className="mt-12 pt-8 border-t">
            <h3 className="text-xl font-semibold mb-6">معاينة الصفحة</h3>
            <div className="rounded-xl p-6">
              <PagePreview data={watch()} isPreview={true} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}