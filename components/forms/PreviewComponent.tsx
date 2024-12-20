import { useEffect, useState } from "react";

interface SectionPreview {
  title: string;
  layoutType: "text-only" | "text-image" | "text-below-image";
  content: string;
  image?: string;
  inputs?: { label: string; type: string; value: string }[];
}

interface PreviewProps {
  data: any;
}

const PreviewComponent = ({ data }: PreviewProps) => {
  const [sections, setSections] = useState<SectionPreview[]>([]);

  // تحديث المعاينة بشكل ديناميكي عند التغيير في النموذج
  useEffect(() => {
    const updatedSections = data.sections?.map((section: any) => ({
      title: section.title || "No Title",
      layoutType: section.layoutType,
      content: section.content || "No Content",
      image: section.image || "",
      inputs: section.inputs || [],
    })) || [];
    
    setSections(updatedSections);
  }, [data]); // تحديث المعاينة عند تغيير البيانات

  return (
    <div className="mt-8 p-6 border rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-6">Live Preview</h3>
      <div>
        {/* عرض عنوان الصفحة */}
        <p className="text-lg">
          <strong className="font-semibold">Page Title:</strong> {data.title || "No Title"}
        </p>
      </div>

      {/* عرض الأقسام */}
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mt-6">
          <h4 className="text-xl font-medium mb-4">{section.title}</h4>

          {/* عرض المحتوى حسب التصميم */}
          <div
            className={`
              ${section.layoutType === "text-only" ? "text-left" : "flex gap-4"}
              ${section.layoutType === "text-image" ? "items-center" : ""}
              ${section.layoutType === "text-below-image" ? "flex-col" : ""}
            `}
          >
            {/* عرض النص */}
            <div className={`flex-1 ${section.layoutType === "text-below-image" ? "mb-4" : ""}`}>
              <p className="text-gray-700">{section.content}</p>
            </div>

            {/* عرض الصورة إذا كانت موجودة */}
            {section.layoutType !== "text-only" && section.image && (
              <div className="flex-shrink-0">
                <div
                  className={`w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center`}
                  style={{
                    backgroundImage: `url(${section.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <span className="text-white font-semibold">Image</span>
                </div>
              </div>
            )}
          </div>

          {/* عرض المدخلات داخل القسم */}
          {section.inputs?.length ? (
            <ul className="list-inside pl-4 mt-4">
              {section.inputs.map((input, inputIndex) => (
                <li key={inputIndex} className="mb-2">
                  <strong>{input.label}:</strong> <em>{input.type}</em>
                  <p className="ml-4 text-gray-700">{input.value}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No inputs available for this section.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default PreviewComponent;
