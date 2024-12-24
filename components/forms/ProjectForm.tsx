// components/forms/ProjectForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TextEditor } from './TextEditor';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader } from '../ui/card';
import { createProject, deleteProject, updateProject } from '@/actions/project';
import { ProjectFormValues, projectSchema } from '@/schemas';
import { ProjectBasicInfo } from '../content/project-basic-info';
import { ProjectImages } from '../content/project-images';
import { ProjectActions } from '../content/project-actions';

interface ProjectFormProps {
  initialData?: any;
  mode: "create" | "edit";
}

export function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialData?.content || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      targetAmount: initialData?.targetAmount || 0,
      startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : undefined,
      endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : undefined,
      content: initialData?.content || "",
      isPublished: initialData?.isPublished || false,
    }
  });

  const [coverImage, setCoverImage] = useState({
    preview: initialData?.coverImage || '',
    file: null as File | null
  });
  
  const [galleryImages, setGalleryImages] = useState<Array<{
    preview: string;
    file: File | null;
    publicId?: string;
  }>>(initialData?.images?.map((img: any) => ({
    preview: img.url,
    file: null,
    publicId: img.publicId
  })) || []);

  const isEditing = !!initialData;

  const handleCoverImageChange = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      setCoverImage({
        preview,
        file
      });
    }
  };

  const handleGalleryImagesChange = async (files: File[]) => {
    const newImages = await Promise.all(files.map(async (file) => ({
      preview: URL.createObjectURL(file),
      file
    })));
    setGalleryImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setLoading(true);
    setError('');

    try {
      let finalCoverImageUrl = initialData?.coverImage || '';
      if (coverImage.file) {
        const formData = new FormData();
        formData.append('file', coverImage.file);
        formData.append('path', 'projects/covers');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const uploadData = await response.json();
        if (uploadData.secure_url) {
          finalCoverImageUrl = uploadData.secure_url;
        }
      }

      const processedGalleryImages = await Promise.all(
        galleryImages.map(async (img) => {
          if (img.file) {
            const formData = new FormData();
            formData.append('file', img.file);
            formData.append('path', 'projects/gallery');

            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            });

            const uploadData = await response.json();
            if (uploadData.secure_url) {
              return {
                url: uploadData.secure_url,
                publicId: uploadData.public_id
              };
            }
          }
          if (img.preview && !img.preview.startsWith('blob:')) {
            return {
              url: img.preview,
              publicId: img.publicId
            };
          }
          return null;
        })
      );

      const finalGalleryImages = processedGalleryImages.filter(Boolean);

      const projectData = {
        ...data,
        content,
        coverImage: finalCoverImageUrl,
        images: finalGalleryImages,
      };

      const result = isEditing
        ? await updateProject(initialData.id, projectData)
        : await createProject(projectData);

      if (result.success) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        setError(result.error || 'حدث خطأ أثناء حفظ الحملة');
      }
    } catch (err: any) {
      console.error('Error saving project:', err);
      setError(err.message || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;

    setDeleteLoading(true);
    try {
      const result = await deleteProject(Number(initialData.id));

      if (result.success) {
        router.push('/admin/projects');
        router.refresh();
      } else {
        setError(result.message || 'حدث خطأ أثناء حذف الحملة');
      }
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setError(typeof err === 'string' ? err : err.message || 'حدث خطأ غير متوقع أثناء الحذف');
    } finally {
      setDeleteLoading(false);
    }
  };


  return (
    <div className="mx-auto w-full">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">
            {mode === "create" ? "إنشاء حملة جديدة" : "تعديل حملة"}
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <ProjectBasicInfo 
              register={register}
              errors={errors}
              loading={loading}
            />

            <ProjectImages 
              coverImage={coverImage}
              galleryImages={galleryImages}
              onCoverImageChange={handleCoverImageChange}
              onGalleryImagesChange={handleGalleryImagesChange}
              onRemoveCoverImage={() => setCoverImage({ preview: '', file: null })}
              onRemoveGalleryImage={handleRemoveGalleryImage}
              loading={loading}
            />

            <div>
              <Label>محتوى الحملة</Label>
              <TextEditor
                value={content}
                onChange={setContent}
              />
            </div>

            <ProjectActions 
              register={register}
              isEditing={!!initialData}
              loading={loading}
              deleteLoading={deleteLoading}
              onDelete={handleDelete}
              setValue={setValue}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}