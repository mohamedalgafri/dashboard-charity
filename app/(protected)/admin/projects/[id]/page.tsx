// app/(dashboard)/admin/projects/[id]/page.tsx
import { ProjectForm } from "@/components/forms/ProjectForm";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

async function getProject(id: string) {
  try {
    if (id === 'new') return null;

    const project = await db.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        images: true
      }
    });

    if (!project) return null;

    return project;
  } catch (error) {
    return null;
  }
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const isNewProject = params.id === "new";
  const project = await getProject(params.id);

  if (!isNewProject && !project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isNewProject ? "إنشاء مشروع جديد" : "تعديل المشروع"}
      </h1>
      
      <ProjectForm
        initialData={project}
      />
    </div>
  );
}