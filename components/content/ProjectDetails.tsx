import { type Project } from "@prisma/client";
import ProjectsSlider from "@/components/content/ProjectsSlider";
import DonationForm from "@/components/forms/DonationForm";
import DonationProgress from "./DonationProgress";

interface ProjectWithImages extends Project {
  images: {
    id: number;
    url: string;
    order: number | null;
  }[];
}

interface ProjectDetailsProps {
  project: ProjectWithImages;
  relatedProjects: ProjectWithImages[];
}

export default function ProjectDetails({ project, relatedProjects }: ProjectDetailsProps) {
  const isProjectCompleted = project.currentAmount >= (project.targetAmount || 0);
  if (!project) {
    return (
      <div className="container mx-auto py-8 text-center">
        لم يتم العثور على المشروع
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {project.coverImage ? (
            <div className="relative aspect-video">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="w-full aspect-video bg-gray-200 rounded-lg" />
          )}
          
          {project.images && project.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {project.images.map((image) => (
                <div key={image.id} className="relative aspect-square">
                  <img
                    src={image.url}
                    alt={`صورة إضافية للمشروع ${project.title}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{project.title}</h1>
            {project.description && (
              <p className="text-gray-600 mt-2">{project.description}</p>
            )}
          </div>

          <DonationProgress 
            currentAmount={project.currentAmount}
            targetAmount={project.targetAmount || 0}
          />

          {project.content && (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: project.content }} 
            />
          )}
        </div>
      </div>

      {!isProjectCompleted ? (
        <DonationForm 
          selectedProject={{
            id: project.id,
            title: project.title
          }} 
          className="max-w-xl mx-auto"
        />
      ) : (
        <div className="text-center py-8 bg-green-50 rounded-lg">
          <p className="text-green-600 font-medium text-lg">
            تم اكتمال التبرعات لهذا المشروع
            {project.currentAmount > (project.targetAmount || 0) && 
              " وتم تجاوز المبلغ المستهدف"}
          </p>
        </div>
      )}

      {relatedProjects && relatedProjects.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">مشاريع أخرى قد تهمك</h2>
          <ProjectsSlider 
            projects={relatedProjects.filter(p => p.id !== project.id)} 
          />
        </div>
      )}
    </div>
  );
}