// components/forms/ProjectForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TextEditor } from './TextEditor';
import { ImageUploader } from './ImageUploader';
import { createProject, deleteProject, updateProject } from '@/actions/project';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader } from '../ui/card';

// تعريف نوع البيانات باستخدام Zod
const projectSchema = z.object({
  title: z.string().min(1, { message: "عنوان الحملة مطلوب" }),
  description: z.string().optional(),
  targetAmount: z.number({ 
    required_error: "المبلغ المستهدف مطلوب",
    invalid_type_error: "يجب أن يكون المبلغ رقماً"
  }).min(0, { message: "يجب أن يكون المبلغ أكبر من 0" }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  content: z.string().optional(),
  isPublished: z.boolean().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

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

  // صورة الغلاف والصور الإضافية
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

  // معالجة تغيير صورة الغلاف
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

  // معالجة تغيير الصور الإضافية
  const handleGalleryImagesChange = async (files: File[]) => {
    const newImages = await Promise.all(files.map(async (file) => ({
      preview: URL.createObjectURL(file),
      file
    })));
    setGalleryImages(prev => [...prev, ...newImages]);
  };

  // معالجة حذف الصور الإضافية
  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProjectFormValues) => {
    setLoading(true);
    setError('');

    try {
      // تجهيز صورة الغلاف
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

      // تجهيز الصور الإضافية
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* عنوان الحملة */}
              <div className="md:col-span-2">
                <label className="block mb-2">عنوان الحملة *</label>
                <input
                  {...register("title")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                {errors.title && (
                  <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* الوصف المختصر */}
              <div className="md:col-span-2">
                <label className="block mb-2">الوصف المختصر</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              {/* المبلغ المستهدف */}
              <div>
                <label className="block mb-2">المبلغ المستهدف *</label>
                <input
                  type="number"
                  {...register("targetAmount", { valueAsNumber: true })}
                  min="0"
                  step="0.01"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                {errors.targetAmount && (
                  <p className="text-red-600 text-sm mt-1">{errors.targetAmount.message}</p>
                )}
              </div>

              <div></div>

              {/* تاريخ البداية */}
              <div>
                <label className="block mb-2">تاريخ البداية</label>
                <input
                  type="date"
                  {...register("startDate")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              {/* تاريخ النهاية */}
              <div>
                <label className="block mb-2">تاريخ النهاية</label>
                <input
                  type="date"
                  {...register("endDate")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
            </div>

            {/* صورة الغلاف */}
            <div>
              <label className="block mb-2">صورة الغلاف</label>
              <ImageUploader
                onImagesChange={handleCoverImageChange}
                previewImages={coverImage.preview ? [coverImage.preview] : []}
                onRemoveImage={() => setCoverImage({ preview: '', file: null })}
                disabled={loading}
                maxImages={1}
              />
            </div>

            {/* الصور الإضافية */}
            <div>
              <label className="block mb-2">صور إضافية</label>
              <ImageUploader
                onImagesChange={handleGalleryImagesChange}
                previewImages={galleryImages.map(img => img.preview)}
                onRemoveImage={handleRemoveGalleryImage}
                disabled={loading}
                maxImages={5}
              />
            </div>

            {/* محتوى الحملة */}
            <div>
              <label className="block mb-2">محتوى الحملة</label>
              <TextEditor
                value={content}
                onChange={setContent}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 focus:ring-2 focus:ring-blue-500"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <span className="size-5 border-y-2 border-white rounded-full animate-spin"></span>
                      جاري الحفظ...
                    </div>
                  ) : (
                    isEditing ? "تحديث الحملة" : "حفظ الحملة"
                  )}
                </button>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("isPublished")}
                    className="rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span>نشر الحملة</span>
                </label>
              </div>

              {isEditing && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 focus:ring-2 focus:ring-red-500"
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'جاري الحذف...' : 'حذف الحملة'}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>تأكيد حذف الحملة</AlertDialogTitle>
                      <AlertDialogDescription>
                        هل أنت متأكد من حذف هذا الحملة؟ هذا الإجراء لا يمكن التراجع عنه.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      >
                        تأكيد الحذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}