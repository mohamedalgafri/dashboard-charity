// app/(marketing)/projects/[slug]/page.tsx
import { getProject, getRelatedProjects } from "@/actions/project";
import ProjectDetails from "@/components/content/ProjectDetails";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 6;

export default async function ProjectPage({ params }: PageProps) {
  if (!params.slug) {
    notFound();
  }

  const project = await getProject(params.slug);
  
  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(params.slug);

  return (
    <Suspense fallback={<div>جاري التحميل...</div>}>
      <ProjectDetails 
        project={project}
        relatedProjects={relatedProjects}
      />
    </Suspense>
  );
}
