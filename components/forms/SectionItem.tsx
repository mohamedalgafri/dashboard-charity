// components/forms/SectionItem.tsx
"use client";

import Image from "next/image";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type { FormSchema, LayoutType } from "@/types/form-types";
import { TextEditor } from "./TextEditor";
import { LAYOUT_TYPES } from "@/types/form-types";

interface SectionItemProps {
    index: number;
    form: UseFormReturn<FormSchema>;
    onRemove: () => void;
    isLoading: boolean;
}

export function SectionItem({ index, form, onRemove, isLoading }: SectionItemProps) {
    const { register, watch, setValue } = form;

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const previewUrl = URL.createObjectURL(file);
                setValue(`sections.${index}`, {
                    ...form.getValues(`sections.${index}`),
                    image: previewUrl,
                    imageFile: file
                  });
            } catch (error) {
                console.error("Error handling image:", error);
            }
        }
    };

    return (
        <div className="border rounded-lg p-6 relative hover:border-blue-200 transition-colors">
            <Button
                type="button"
                onClick={onRemove}
                className="absolute left-2 top-2"
                variant="destructive"
                size="sm"
            >
                حذف القسم
            </Button>

            <div className="space-y-6 mt-8">
                <div>
                    <label className="block text-sm font-medium mb-1">عنوان القسم</label>
                    <Input
                        {...register(`sections.${index}.title`)}
                        placeholder="أدخل عنوان القسم"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">نوع المحتوى</label>
                    <Select
                        onValueChange={(value: "editor" | "html") => {
                            setValue(`sections.${index}.contentType`, value);
                            setValue(`sections.${index}.content`, "");
                        }}
                        value={watch(`sections.${index}.contentType`) || "editor"}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="اختر نوع المحتوى" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="editor">محرر النصوص</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {watch(`sections.${index}.contentType`) === "editor" && (
                    <div>
                        <label className="block text-sm font-medium mb-1">نوع التخطيط</label>
                        <Select
                            onValueChange={(value) => setValue(`sections.${index}.layoutType`, value as LayoutType)}
                            value={watch(`sections.${index}.layoutType`) || "text-only"}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="اختر نوع التخطيط" />
                            </SelectTrigger>
                            <SelectContent>
                                {LAYOUT_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {getLayoutTypeLabel(type)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {watch(`sections.${index}.contentType`) === "editor" &&
                    watch(`sections.${index}.layoutType`) !== "text-only" && (
                        <div>
                            <label className="block text-sm font-medium mb-1">الصورة</label>
                            <div className="space-y-2">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={isLoading}
                                />
                                {watch(`sections.${index}.image`) && (
                                    <div className="relative w-40 h-40">
                                        <Image
                                            src={watch(`sections.${index}.image`) || ''}
                                            alt="معاينة"
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                <div>
                    <label className="block text-sm font-medium mb-1">المحتوى</label>
                    {watch(`sections.${index}.contentType`) === "editor" ? (
                        <TextEditor
                            value={watch(`sections.${index}.content`)}
                            onChange={(content) => {
                                setValue(`sections.${index}.content`, content);
                            }}
                        />
                    ) : (
                        <div className="space-y-4">
                            <Textarea
                                value={watch(`sections.${index}.content`)}
                                onChange={(e) => setValue(`sections.${index}.content`, e.target.value)}
                                className="font-mono min-h-[200px] text-sm"
                                placeholder='<div class="text-blue-500 text-xl mb-4">مثال على محتوى HTML</div>'
                            />
                            <div className="text-sm text-gray-500">
                                يمكنك استخدام جميع classes من Tailwind CSS مباشرة في الـ HTML
                            </div>
                        </div>
                    )}
                </div>

                {/* خيارات القسم */}
                <div className="flex flex-wrap gap-6 pt-4 border-t">
                    <div className="flex items-center gap-2">
                        <Switch
                            id={`section-visibility-${index}`}
                            checked={watch(`sections.${index}.isVisible`)}
                            onCheckedChange={(checked) => setValue(`sections.${index}.isVisible`, checked)}
                        />
                        <label htmlFor={`section-visibility-${index}`} className="text-sm font-medium">
                            القسم مرئي
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        <Switch
                            id={`section-background-${index}`}
                            checked={watch(`sections.${index}.showBgColor`)}
                            onCheckedChange={(checked) => setValue(`sections.${index}.showBgColor`, checked)}
                        />
                        <label htmlFor={`section-background-${index}`} className="text-sm font-medium">
                            تفعيل لون الخلفية
                        </label>
                    </div>

                    {watch(`sections.${index}.showBgColor`) && (
                        <div className="flex items-center gap-2">
                            <Input
                                type="color"
                                {...register(`sections.${index}.bgColor`)}
                                className="w-10 h-10 p-1"
                            />
                            <span className="text-sm text-gray-500">اختر لون الخلفية</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function getLayoutTypeLabel(type: LayoutType): string {
    const labels: Record<LayoutType, string> = {
        "text-only": "نص فقط",
        "text-image": "نص مع صورة على اليمين",
        "image-text": "صورة مع نص على اليمين",
        "text-below-image": "نص أسفل الصورة",
        "image-below-text": "صورة أسفل النص"
    };
    return labels[type];
}