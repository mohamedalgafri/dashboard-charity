import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import EditPageClient from "./page";

export default async function EditPageLayout({
  params
}: {
  params: { id: string }
}) {
  const page = await db.page.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      sections: {
        include: {
          inputs: true
        }
      }
    }
  });

  if (!page) {
    notFound();
  }

  // تحويل البيانات من قاعدة البيانات إلى الشكل المطلوب للنموذج
  const transformedData = {
    ...page,
    sections: page.sections.map(section => {
      const contentInput = section.inputs.find(input => input.label === "content");
      const imageInput = section.inputs.find(input => input.label === "image");
      
      return {
        title: section.title,
        content: contentInput?.value || "",
        contentType: contentInput?.type || "editor",
        layoutType: section.layoutType,
        image: imageInput?.value,
        isVisible: section.isVisible,
        showBgColor: section.showBgColor,
        bgColor: section.bgColor,
      };
    })
  };

  return <EditPageClient initialData={transformedData} />;
}