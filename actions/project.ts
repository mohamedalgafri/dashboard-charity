// actions/project.ts
'use server'

import { db } from '@/lib/db';
import { ProjectFormData } from '@/types/form-types';
import { revalidatePath } from 'next/cache';
import { createSlug } from '@/utils/slugify';
import { deleteFromCloudinary, deleteMultipleFromCloudinary } from '@/lib/cloudinary';


export async function createProject(formData: ProjectFormData) {
  try {

    const slug = createSlug(formData.title);

    const projectData: any = {
      title: formData.title,
      slug: slug,
      description: formData.description,
      content: formData.content,
      targetAmount: formData.targetAmount,
      startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
      endDate: formData.endDate ? new Date(formData.endDate) : null,
      coverImage: formData.coverImage,
      isPublished: formData.isPublished,
    };

    if (formData.images && formData.images.length > 0) {
      projectData.images = {
        create: formData.images.map(image => ({
          url: image.url,
          publicId: image.publicId,
          order: 0
        }))
      };
    }

    const project = await db.project.create({
      data: projectData
    });

    revalidatePath('/admin/projects');
    return { success: true, data: project };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: 'فشل في إنشاء المشروع' };
  }
}

export async function updateProject(id: number, formData: ProjectFormData) {
    try {

      const slug = formData.title ? createSlug(formData.title) : undefined;

      // حذف كل الصور القديمة أولاً
      await db.projectImage.deleteMany({
        where: {
          projectId: id
        }
      });
  
      const projectData: any = {
        title: formData.title,
        slug: slug,
        description: formData.description,
        content: formData.content,
        targetAmount: formData.targetAmount,
        startDate: formData.startDate ? new Date(formData.startDate) : new Date(),
        endDate: formData.endDate ? new Date(formData.endDate) : null,
        coverImage: formData.coverImage,
        isPublished: formData.isPublished,
      };
  
      // إضافة الصور الجديدة فقط
      if (formData.images && formData.images.length > 0) {
        projectData.images = {
          create: formData.images.map(image => ({
            url: image.url,
            publicId: image.publicId || '',
            order: 0
          }))
        };
      }
  
      const project = await db.project.update({
        where: { id },
        data: projectData
      });
  
      revalidatePath('/admin/projects');
      return { success: true, data: project };
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, error: 'فشل في تحديث المشروع' };
    }
  }

  export async function getProject(slug: string) {
    if (!slug) return null;
  
    try {
      const project = await db.project.findUnique({
        where: { slug },
        include: {
          images: true,
          donations: {
            select: {
              id: true,
              amount: true,
              message: true,
              createdAt: true,
              status: true,
              donor: {
                select: {
                  name: true,
                  anonymous: true,
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        },
      });
  
      return project;
    } catch (error) {
      console.error("Error fetching project:", error);
      return null;
    }
  }
  
  export async function getRelatedProjects(currentSlug: string) {
    try {
      const projects = await db.project.findMany({
        where: {
          slug: { not: currentSlug },
          isPublished: true,
        },
        include: {
          images: true,
        },
        take: 4,
      });
  
      return projects;
    } catch (error) {
      console.error("Error fetching related projects:", error);
      return [];
    }
}

export async function getProjects() {
  try {
    const projects = await db.project.findMany({
      where: {
        isPublished: true
      },
      include: {
        images: {
          orderBy: {
            order: 'asc'
          }
        },
        donations: {
          where: {
            status: 'completed'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export async function deleteProject(projectId: number) {
  if (!projectId) {
    return {
      success: false,
      message: "معرف المشروع غير صالح"
    };
  }

  try {
    // جلب المشروع مع الصور والتبرعات قبل الحذف
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        images: true,
        donations: true, // إضافة التبرعات
      },
    });

    if (!project) {
      return {
        success: false,
        message: "المشروع غير موجود"
      };
    }

    // تجميع الصور للحذف
    const imagesToDelete: string[] = [];
    if (project.coverImage && typeof project.coverImage === 'string') {
      imagesToDelete.push(project.coverImage);
    }
    if (project.images && project.images.length > 0) {
      const imagePublicIds = project.images
        .filter(img => img.publicId)
        .map(img => img.publicId!);
      imagesToDelete.push(...imagePublicIds);
    }

    // حذف الصور من Cloudinary
    if (imagesToDelete.length > 0) {
      const deleteResult = await deleteMultipleFromCloudinary(imagesToDelete);
      if (!deleteResult.success) {
        console.error('فشل في حذف بعض الصور:', deleteResult.errors);
      }
    }

    // استخدام المعاملة (transaction) لحذف كل البيانات المرتبطة
    await db.$transaction([
      // حذف التبرعات المرتبطة
      db.donation.deleteMany({
        where: {
          projectId: projectId
        }
      }),
      
      // حذف الصور المرتبطة
      db.projectImage.deleteMany({
        where: {
          projectId: projectId
        }
      }),

      // حذف المشروع نفسه
      db.project.delete({
        where: {
          id: projectId
        }
      })
    ]);

    revalidatePath('/admin/projects');
    
    return {
      success: true,
      message: "تم حذف المشروع وجميع البيانات المرتبطة به بنجاح"
    };
  } catch (error) {
    console.error("Error deleting project:", error);
    const errorMessage = error instanceof Error 
      ? error.message 
      : "حدث خطأ غير متوقع أثناء حذف المشروع";

    return {
      success: false,
      message: errorMessage
    };
  }
}