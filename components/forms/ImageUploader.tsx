"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { X, Upload } from "lucide-react";
import Image from "next/image";

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
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const remainingSlots = maxImages - existingImages.length;
    const newFiles = acceptedFiles.slice(0, remainingSlots);
    if (newFiles.length > 0) {
      onImagesChange(newFiles);
    }
  }, [maxImages, existingImages.length, onImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    disabled,
    multiple: true
  });

  const handleRemoveImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      const newExistingImages = existingImages.filter((_, i) => i !== index);
      onExistingImagesChange?.(newExistingImages);
    } else {
      onImagesChange([]);
    }
  };

  const totalImages = existingImages.length + previewImages.length;

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-4
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-500 '}
        transition-colors duration-200 ease-in-out
      `}
    >
      <input {...getInputProps()} />
      
      {/* المنطقة العلوية للسحب والإفلات */}
      {totalImages === 0 && (
        <div className="flex flex-col items-center justify-center space-y-2 text-center py-8">
          <Upload className="h-4 w-4 text-gray-400" />
          <div className="text-gray-600">
            {isDragActive ? (
              <p>اسحب الملفات هنا...</p>
            ) : (
              <p>اسحب وأفلت الصور هنا، أو انقر للاختيار</p>
            )}
          </div>
          <p className="text-xs text-gray-500">
            PNG, JPG, WEBP حتى {maxImages} صور
          </p>
        </div>
      )}

      {/* شبكة الصور */}
      {(existingImages.length > 0 || previewImages.length > 0) && (
        <div className="flex flex-wrap gap-5 mt-4">
          {/* الصور الحالية */}
          {existingImages.map((image, index) => (
            <div key={`existing-${image.url}`} className="relative group">
              <div className="relative w-24 h-24">
                <Image
                  src={image.url}
                  alt="preview"
                  className="w-full h-full object-cover rounded-lg"
                  width={100}
                  height={100}
                />
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index, true);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          {/* الصور المعاينة */}
          {previewImages.map((preview, index) => (
            <div key={`preview-${index}`} className="relative group">
              <div className="relative w-24 h-24">
                <Image
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-cover rounded-lg"
                  width={100}
                  height={100}
                />
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(index, false);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          {/* أيقونة الإضافة إذا كان هناك مساحة لمزيد من الصور */}
           {totalImages < maxImages && (
            <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
              <Upload className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}