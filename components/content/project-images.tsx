// components/project/project-images.tsx

import { ImageUploader } from '../forms/ImageUploader';
import { Label } from '../ui/label';

interface ProjectImagesProps {
  coverImage: { preview: string; file: File | null };
  galleryImages: Array<{ preview: string; file: File | null; publicId?: string }>;
  onCoverImageChange: (files: File[]) => void;
  onGalleryImagesChange: (files: File[]) => void;
  onRemoveCoverImage: () => void;
  onRemoveGalleryImage: (index: number) => void;
  loading?: boolean;
}

export function ProjectImages({
  coverImage,
  galleryImages,
  onCoverImageChange,
  onGalleryImagesChange,
  onRemoveCoverImage,
  onRemoveGalleryImage,
  loading
}: ProjectImagesProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label>صورة الغلاف</Label>
        <ImageUploader
          onImagesChange={onCoverImageChange}
          previewImages={coverImage.preview ? [coverImage.preview] : []}
          onRemoveImage={onRemoveCoverImage}
          disabled={loading}
          maxImages={1}
        />
      </div>

      <div>
        <Label>صور إضافية</Label>
        <ImageUploader
          onImagesChange={onGalleryImagesChange}
          previewImages={galleryImages.map(img => img.preview)}
          onRemoveImage={onRemoveGalleryImage}
          disabled={loading}
          maxImages={5}
        />
      </div>
    </div>
  );
}