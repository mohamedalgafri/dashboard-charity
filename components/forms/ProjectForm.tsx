// components/forms/ProjectForm.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TextEditor } from './TextEditor';
import { ImageUploader } from './ImageUploader';
import { createProject, deleteProject, updateProject } from '@/actions/project';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface ProjectFormProps {
    initialData?: any;
}

interface GalleryUrl {
    url: string;
    publicId: string;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
    const router = useRouter();
    const [content, setContent] = useState(initialData?.content || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    // صورة الغلاف
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImage || '');

    // الصور الإضافية
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryUrls, setGalleryUrls] = useState<GalleryUrl[]>(
        initialData?.images || []
    );

    const isEditing = !!initialData;

    // تحويل الملف إلى URL للمعاينة
    const createImagePreview = useCallback((file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
        });
    }, []);

    // معالجة تغيير صورة الغلاف
    const handleCoverImageChange = useCallback(async (files: File[]) => {
        if (files.length > 0) {
            setCoverImageFile(files[0]);
            const preview = await createImagePreview(files[0]);
            // تعديل هنا
            setCoverImageUrl(preview);
        } else {
            setCoverImageFile(null);
            setCoverImageUrl('');
        }
    }, [createImagePreview]);

    const handleGalleryImagesChange = useCallback(async (files: File[]) => {
        if (files.length > 0) {
            // نحتفظ بالملفات القديمة ونضيف عليها الجديدة
            setGalleryFiles(prevFiles => [...prevFiles, ...files]);
            
            // نقوم بإنشاء معاينات للصور الجديدة
            const previews = await Promise.all(files.map(createImagePreview));
            
            // نحتفظ بالصور القديمة ونضيف عليها الجديدة
            setGalleryUrls(prevUrls => [
                ...prevUrls,
                ...previews.map(url => ({ url, publicId: '' }))
            ]);
        }
    }, [createImagePreview]);
    
    // تحديث وظيفة حذف الصور
    const handleExistingGalleryImagesChange = useCallback((images: GalleryUrl[]) => {
        setGalleryUrls(images);
        setGalleryFiles([]); // نمسح الملفات عند حذف الصور
    }, []);

    // رفع صورة إلى Cloudinary
    const uploadImage = async (file: File, folder: string) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!res.ok) {
            throw new Error(`فشل رفع الصورة: ${res.statusText}`);
        }

        const data = await res.json();
        if (data.error) {
            throw new Error(data.error);
        }

        return data;
    };

    // معالجة تقديم النموذج
    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');

        try {
            let finalCoverImageUrl = coverImageUrl;
            let newGalleryUrls: GalleryUrl[] = [...galleryUrls];

            // رفع صورة الغلاف الجديدة إذا تم تحديدها
            if (coverImageFile) {
                try {
                    const coverData = await uploadImage(coverImageFile, 'projects/covers');
                    finalCoverImageUrl = coverData.url;
                } catch (error) {
                    console.error('خطأ في رفع صورة الغلاف:', error);
                    throw new Error('فشل في رفع صورة الغلاف');
                }
            }

            // رفع الصور الإضافية الجديدة
            if (galleryFiles.length > 0) {
                try {
                    const uploadedGalleryUrls = await Promise.all(
                        galleryFiles.map(file => uploadImage(file, 'projects/gallery'))
                    );

                    // تحديث هنا: نستخدم فقط الصور الجديدة المرفوعة
                    newGalleryUrls = uploadedGalleryUrls.map(data => ({
                        url: data.url,
                        publicId: data.publicId
                    }));
                } catch (error) {
                    console.error('خطأ في رفع الصور الإضافية:', error);
                    throw new Error('فشل في رفع الصور الإضافية');
                }
            }

            // تجهيز بيانات المشروع
            const projectData = {
                title: formData.get('title') as string,
                description: formData.get('description') as string || undefined,
                content: content || undefined,
                targetAmount: formData.get('targetAmount') ?
                    parseFloat(formData.get('targetAmount') as string) : undefined,
                startDate: formData.get('startDate') || undefined,
                endDate: formData.get('endDate') || undefined,
                coverImage: finalCoverImageUrl || undefined,
                images: isEditing ? newGalleryUrls : [...newGalleryUrls],
                isPublished: formData.get('isPublished') === 'on'
            };

            // استدعاء server action
            const result = isEditing
                ? await updateProject(initialData.id, projectData)
                : await createProject(projectData);

            if (result.success) {
                router.push('/admin/projects');
                router.refresh();
                setLoading(false);
            } else {
                setError(result.error || 'حدث خطأ أثناء حفظ المشروع');
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
                setError(result.message || 'حدث خطأ أثناء حذف المشروع');
            }
        } catch (err: any) {
            console.error('Error deleting project:', err);
            setError(typeof err === 'string' ? err : err.message || 'حدث خطأ غير متوقع أثناء الحذف');
        } finally {
            setDeleteLoading(false);
        }
    };
   
    return (
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
                {/* عنوان المشروع */}
                <div className="md:col-span-2">
                    <label className="block mb-2 text-gray-700">عنوان المشروع *</label>
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
                    <label className="block mb-2 text-gray-700">الوصف المختصر</label>
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
                    <label className="block mb-2 text-gray-700">المبلغ المستهدف</label>
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

                {/* تاريخ البداية */}
                <div>
                    <label className="block mb-2 text-gray-700">تاريخ البداية</label>
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
                    <label className="block mb-2 text-gray-700">تاريخ النهاية</label>
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
                <label className="block mb-2 text-gray-700">صورة الغلاف</label>
                <ImageUploader
                    onImagesChange={handleCoverImageChange}
                    previewImages={[coverImageUrl].filter(Boolean)}
                    disabled={loading}
                    maxImages={1}
                />
            </div>

            {/* الصور الإضافية */}
            <div>
                <label className="block mb-2 text-gray-700">صور إضافية</label>
                <ImageUploader
                    onImagesChange={handleGalleryImagesChange}
                    // نحذف galleryUrls.map(img => img.url) ونستخدم فقط الـ existingImages
                    previewImages={[]} // هنا التعديل - نجعلها فارغة لأننا سنعرض الصور من خلال existingImages فقط
                    existingImages={galleryUrls}
                    onExistingImagesChange={handleExistingGalleryImagesChange}
                    disabled={loading}
                    maxImages={5}
                />
            </div>

            {/* محتوى المشروع */}
            <div>
                <label className="block mb-2 text-gray-700">محتوى المشروع</label>
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
                            isEditing ? "تحديث المشروع" : "حفظ المشروع"
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
                        <span className="text-gray-700">نشر المشروع</span>
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
                                {deleteLoading ? 'جاري الحذف...' : 'حذف المشروع'}
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>تأكيد حذف المشروع</AlertDialogTitle>
                                <AlertDialogDescription>
                                    هل أنت متأكد من حذف هذا المشروع؟ هذا الإجراء لا يمكن التراجع عنه.
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
    );
}