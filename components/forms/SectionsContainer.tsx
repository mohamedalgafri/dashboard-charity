import { useEffect, useRef } from "react";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Sortable from 'sortablejs';
import { SectionItem } from "../forms/SectionItem";
import type { LayoutType, PageFormProps } from "@/types/form-types";

// components/sections/SectionsContainer.tsx
export function SectionsContainer({ form, isLoading }: PageFormProps) {
    const { control, setValue } = form;
    const { fields, append, remove, move } = useFieldArray({
      control,
      name: "sections"
    });
    
    const sectionsRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (sectionsRef.current) {
        Sortable.create(sectionsRef.current, {
          animation: 150,
          onEnd: (event) => {
            const { oldIndex, newIndex } = event;
            if (oldIndex !== undefined && newIndex !== undefined) {
              move(oldIndex, newIndex);
              // تحديث حقل order لكل قسم
              fields.forEach((_, index) => {
                setValue(`sections.${index}`, {
                  ...form.getValues(`sections.${index}`),
                  order: index
                });
              });
            }
          },
        });
      }
    }, [fields, move, setValue, form]);
  
    const addSection = () => {
        append({
          title: "",
          content: "",
          contentType: "editor",
          layoutType: "text-only" as LayoutType,  
          isVisible: true,
          showBgColor: false,
          order: fields.length,
          inputs: []
        });
      };
  
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">الأقسام</h3>
          <Button
            type="button"
            onClick={addSection}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <span>+</span>
            إضافة قسم
          </Button>
        </div>
  
        <div ref={sectionsRef} className="space-y-6">
          {fields.map((field, index) => (
            <SectionItem
              key={field.id}
              index={index}
              form={form}
              onRemove={() => remove(index)}
              isLoading={isLoading as boolean}
            />
          ))}
        </div>
      </div>
    );
  }