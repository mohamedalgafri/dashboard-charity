"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PageForm from "@/components/forms/PageForm";
import { updatePage } from "@/actions/page";
import type { FormSchema } from "@/types/form-types";

interface EditPageProps {
  initialData: any;
}

export default function EditPageClient({ initialData }: EditPageProps) {
  const router = useRouter();
  
  const onSubmit = async (data: FormSchema): Promise<void> => {
    try {
      // رفع الصور إلى Cloudinary
      let updatedSections = [...data.sections || []];

      // معالجة الصور
      for (let i = 0; i < updatedSections.length; i++) {
        const section = updatedSections[i];
        if (section.imageFile) {
          const formData = new FormData();
          formData.append("file", section.imageFile);
          formData.append("folder", "page-images");

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Upload failed');
          }

          const uploadData = await response.json();
          
          updatedSections[i] = {
            ...section,
            image: uploadData.url,
            imageFile: undefined
          };
        }
      }

      // تحضير البيانات النهائية
      const finalData = {
        ...data,
        sections: updatedSections.map(section => ({
          title: section.title || "",
          content: section.content || "",
          contentType: section.contentType,
          layoutType: section.layoutType || "text-only",
          image: section.image,
          isVisible: section.isVisible ?? true,
          showBgColor: section.showBgColor ?? false,
          bgColor: section.bgColor || "",
          inputs: [
            {
              label: "content",
              type: section.contentType,
              value: section.content || "",
            },
            ...(section.image ? [{
              label: "image",
              type: "image",
              value: section.image,
            }] : [])
          ]
        }))
      };

      const result = await updatePage(initialData.id, finalData);
      
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/pages");
        router.refresh();
      } else {
        toast.error(result.message || "فشل في تحديث الصفحة");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  return (
    <PageForm 
      mode="edit" 
      initialData={initialData} 
      onSubmit={onSubmit}
    />
  );
}