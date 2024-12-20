// actions/project.ts
'use server'

import { db } from '@/lib/db';
import { ProjectFormData } from '@/types/form-types';
import { revalidatePath } from 'next/cache';

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\u0621-\u064A\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

export async function createProject(formData: ProjectFormData) {
  try {
    const projectData: any = {
      title: formData.title,
      slug: createSlug(formData.title),
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
      // حذف كل الصور القديمة أولاً
      await db.projectImage.deleteMany({
        where: {
          projectId: id
        }
      });
  
      const projectData: any = {
        title: formData.title,
        slug: createSlug(formData.title),
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