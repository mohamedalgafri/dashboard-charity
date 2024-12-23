// components/sections/SectionsContainer.tsx
"use client";

import { useEffect, useRef } from "react";
import { useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Sortable from 'sortablejs';
import { SectionItem } from "../forms/SectionItem";
import type { FormSchema, LayoutType } from "@/types/form-types";
import { UseFormReturn } from "react-hook-form";

interface SectionsContainerProps {
  form: UseFormReturn<FormSchema>;
  isLoading: boolean;
}

export function SectionsContainer({ form, isLoading }: SectionsContainerProps) {
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
        handle: ".drag-handle",
        onEnd: (event) => {
          const { oldIndex, newIndex } = event;
          if (oldIndex !== undefined && newIndex !== undefined) {
            move(oldIndex, newIndex);
            // تحديث ترتيب الأقسام
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
      layoutType: "text-only",
      image: "", // إضافة قيمة افتراضية
      imageFile: null, // إضافة قيمة افتراضية
      isVisible: true,
      showBgColor: false,
      bgColor: "",
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
          disabled={isLoading}
        >
          <span>+</span>
          إضافة قسم
        </Button>
      </div>

      <div ref={sectionsRef} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="group relative">
            <div className="absolute right-2 top-2 cursor-move drag-handle opacity-0 group-hover:opacity-100 transition-opacity">
              ⋮
            </div>
            <SectionItem
              index={index}
              form={form}
              onRemove={() => remove(index)}
              isLoading={isLoading}
            />
          </div>
        ))}
      </div>
    </div>
  );
}