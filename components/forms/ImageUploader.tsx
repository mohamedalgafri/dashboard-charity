"use client";

import { useState, useRef } from "react";  // أضفنا useRef

interface ImageUploaderProps {
  onImagesChange: (files: File[]) => void;
  previewImages: string[];
  disabled?: boolean;
  maxImages?: number;
  existingImages?: { url: string; publicId: string }[];
  onExistingImagesChange?: (images: { url: string; publicId: string }[]) => void;
}

export function ImageUploader({
  onImagesChange,
  previewImages = [],
  disabled = false,
  maxImages = 10,
  existingImages = [],
  onExistingImagesChange
}: ImageUploaderProps) {
  // إضافة مرجع لعنصر الإدخال
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files);
      const remainingSlots = maxImages - existingImages.length;
      const newFiles = selectedFiles.slice(0, remainingSlots);
      
      if (newFiles.length > 0) {
        onImagesChange(newFiles);
      }
      // إعادة تعيين قيمة عنصر الإدخال
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      const newExistingImages = existingImages.filter((_, i) => i !== index);
      onExistingImagesChange?.(newExistingImages);
    } else {
      onImagesChange([]);
      // إعادة تعيين قيمة عنصر الإدخال عند الحذف
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const totalImages = existingImages.length + previewImages.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* عرض الصور الحالية */}
        {existingImages.map((image, index) => (
          <div key={`existing-${image.url}`} className="relative group">
            <div className="relative aspect-video">
              <img
                src={image.url}
                alt="preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveImage(index, true)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {/* عرض الصور الجديدة */}
        {previewImages.map((preview, index) => (
          <div key={`preview-${index}`} className="relative group">
            <div className="relative aspect-video">
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveImage(index, false)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {totalImages < maxImages && !disabled && (
        <div className="mt-4">
          <label className={`block p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 text-center ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
            <input
              ref={fileInputRef}  // إضافة المرجع هنا
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageSelect}
              multiple
              disabled={disabled}
            />
            اضغط لإضافة صور
          </label>
        </div>
      )}
    </div>
  );
}