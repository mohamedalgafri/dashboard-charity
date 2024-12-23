"use client";

import { useRouter } from "next/navigation";
import { AddPage } from "@/actions/page";
import PageForm from "@/components/forms/PageForm";
import { toast } from "sonner";
import type { FormSchema } from "@/types/form-types";

export default function CreatePage() {
  const router = useRouter();

  const handleSubmit = async (data: FormSchema) => {
    try {
      const result = await AddPage(data);
      
      if (result.success) {
        toast.success(result.message);
        router.push("/admin/pages");
        router.refresh();
      } else {
        toast.error(result.message || "حدث خطأ أثناء إنشاء الصفحة");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("حدث خطأ غير متوقع");
    }
  };

  return (
    <div className=" mx-auto py-10 w-full">
      <PageForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}