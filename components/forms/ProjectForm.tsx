// components/forms/ProjectForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextEditor } from './TextEditor';
import { ImageUploader } from './ImageUploader';
import { createProject, deleteProject, updateProject } from '@/actions/project';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader } from '../ui/card';

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

    // معالجة تقديم النموذج
    async function handleSubmit(formData: FormData) {
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

                const data = await response.json();
                if (data.secure_url) {
                    finalCoverImageUrl = data.secure_url;
                }
            }

            // تجهيز الصور الإضافية
            const processedGalleryImages = await Promise.all(
                galleryImages.map(async (img) => {
                    // إذا كان لدينا ملف جديد، نقوم برفعه
                    if (img.file) {
                        const formData = new FormData();
                        formData.append('file', img.file);
                        formData.append('path', 'projects/gallery');

                        const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData
                        });

                        const data = await response.json();
                        if (data.secure_url) {
                            return {
                                url: data.secure_url,
                                publicId: data.public_id
                            };
                        }
                    }
                    // إذا كانت صورة موجودة مسبقاً، نحتفظ بها
                    if (img.preview && !img.preview.startsWith('blob:')) {
                        return {
                            url: img.preview,
                            publicId: img.publicId
                        };
                    }
                    return null;
                })
            );

            // تنظيف البيانات وإزالة null
            const finalGalleryImages = processedGalleryImages.filter(Boolean);

            // تجهيز بيانات الحملة
            const projectData = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                content: content,
                targetAmount: formData.get('targetAmount') ?
                    parseFloat(formData.get('targetAmount') as string) : undefined,
                startDate: formData.get('startDate') || undefined,
                endDate: formData.get('endDate') || undefined,
                coverImage: finalCoverImageUrl,
                images: finalGalleryImages,
                isPublished: formData.get('isPublished') === 'on'
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
    }

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
                    <h2 className="text-2xl font-bold ">
                        {mode === "create" ? "إنشاء حملة جديدة" : "تعديل حملة"}
                    </h2>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            await handleSubmit(formData);
                        }}
                        className="space-y-6"
                    >
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* عنوان الحملة */}
                            <div className="md:col-span-2">
                                <label className="block mb-2 ">عنوان الحملة *</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    defaultValue={initialData?.title}
                                    disabled={loading}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* الوصف المختصر */}
                            <div className="md:col-span-2">
                                <label className="block mb-2 ">الوصف المختصر</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    defaultValue={initialData?.description}
                                    disabled={loading}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* المبلغ المستهدف */}

                            <div>
                                <label className="block mb-2 ">المبلغ المستهدف</label>
                                <input
                                    type="number"
                                    name="targetAmount"
                                    min="0"
                                    step="0.01"
                                    defaultValue={initialData?.targetAmount}
                                    disabled={loading}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div></div>

                            {/* تاريخ البداية */}
                            <div>
                                <label className="block mb-2 ">تاريخ البداية</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    defaultValue={initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : undefined}
                                    disabled={loading}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* تاريخ النهاية */}
                            <div>
                                <label className="block mb-2 ">تاريخ النهاية</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    defaultValue={initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : undefined}
                                    disabled={loading}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* صورة الغلاف */}
                        <div>
                            <label className="block mb-2 ">صورة الغلاف</label>
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
                            <label className="block mb-2 ">صور إضافية</label>
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
                            <label className="block mb-2 ">محتوى الحملة</label>
                            <TextEditor
                                value={content}
                                onChange={setContent}
                            // disabled={loading}
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
                                        name="isPublished"
                                        defaultChecked={initialData?.isPublished}
                                        disabled={loading}
                                        className="rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="">نشر الحملة</span>
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

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}