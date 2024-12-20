import { useFormContext } from "react-hook-form";
import LexicalEditor from "./LexicalEditor"; // تأكد من أنك تقوم بإستيراد الإديتور بشكل صحيح.

const SectionForm = ({ sectionIndex, removeSection, isLoading }: any) => {
  const { register, setValue, watch } = useFormContext();
  const layoutType = watch(`sections.${sectionIndex}.layoutType`);
  const sectionContent = watch(`sections.${sectionIndex}.content`); // هذه القيم يتم متابعتها

  const handleContentChange = (value: string) => {
    // عند التغيير في الإديتور، قم بتحديث الحقل المرتبط بالنموذج
    setValue(`sections.${sectionIndex}.content`, value);
  };

  return (
    <div className="space-y-4 border p-4 rounded-md">
      {/* عنوان القسم */}
      <div>
        <label className="block text-sm font-medium">Section Title</label>
        <input
          {...register(`sections.${sectionIndex}.title`)}
          placeholder="Enter section title"
          className="mt-1"
          disabled={isLoading}
        />
      </div>

      {/* محتوى النصوص */}
      <div>
        <label className="block text-sm font-medium">Section Content</label>
        <LexicalEditor value={sectionContent || ""} onChange={handleContentChange} />
      </div>

      {/* إزالة القسم */}
      <button type="button" onClick={removeSection} disabled={isLoading}>Remove Section</button>
    </div>
  );
};

export default SectionForm;
