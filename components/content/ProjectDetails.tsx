import { type Project } from "@prisma/client";
import ProjectsSlider from "@/components/content/ProjectsSlider";
import DonationForm from "@/components/forms/DonationForm";
import DonationProgress from "./DonationProgress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import ProjectGallery from "./ProjectGallery";
import { notFound } from "next/navigation";

interface ProjectWithImages extends Project {
  images: {
    id: number;
    url: string;
    order: number | null;
  }[];
  donations: {
    id: number;
    amount: number;
    message: string;
    createdAt: Date;
    donor: {
      name: string;
      anonymous: boolean;
    };
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
      notFound()
    );
  }

  // دالة لإنشاء خلفية عشوائية
  const getRandomColor = () => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="container mx-auto py-8 space-y-12">
      {/* صور وتفاصيل الحملة */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <ProjectGallery
            coverImage={project.coverImage}
            images={project.images}
            title={project.title}
          />
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold">{project.title}</h1>
            {project.description && (
              <p className="text-muted-foreground mt-2 text-sm">{project.description}</p>
            )}
          </div>

          <DonationProgress
            currentAmount={project.currentAmount}
            targetAmount={project.targetAmount || 0}
          />
        </div>
      </div>

      {project.content && (
        <div className="prose prose-lg dark:prose-invert  py-2 px-2  md:p-5 rounded-2xl w-full min-w-full bg-violet-200 dark:bg-violet-600 ">

          <div
            className="w-full text-content"
            dangerouslySetInnerHTML={{ __html: project.content }}
          />

        </div>
      )}
      <div className={` ${!isProjectCompleted ? "flex-row" : "flex-col"} flex flex-col lg:flex-row justify-center gap-6`}>

        <div className="w-full">


          {/* نموذج التبرع */}
          {!isProjectCompleted ? (
            <DonationForm selectedProject={
              {
                id: project.id,
                title: project.title
              }
            } />
          ) : (
            <div className="text-center py-8 bg-green-50 dark:bg-green-950 rounded-lg">
              <p className="text-green-600 dark:text-green-400 font-medium text-lg">
                تم اكتمال التبرعات لهذا الحملة
                {project.currentAmount > (project.targetAmount || 0) &&
                  " وتم تجاوز المبلغ المستهدف"}
              </p>
            </div>
          )}
        </div>

        {/* قائمة المتبرعين */}
        <div className="bg-muted/30 w-full rounded-lg py-6 px-4">
          <h2 className="text-xl font-bold mb-6">المتبرعون ({project.donations.length})</h2>
          <ScrollArea className={` ${!isProjectCompleted ? "h-[100px] md:h-[160px] lg:h-[790px]" : " h-auto "}   rounded-md border p-3`}>
            <div className="space-y-4" dir="rtl">
              {project.donations.length > 0 ? (
                project.donations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center gap-4 p-4 bg-background rounded-lg shadow-sm"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={`${getRandomColor()} text-white flex items-center justify-center`}>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {donation.donor.anonymous ? "فاعل خير" : donation.donor.name}
                        </p>
                        <p className="font-bold text-primary">
                          ${Number(donation.amount).toFixed(2)}
                        </p>
                      </div>
                      {donation.message && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {donation.message}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(donation.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                ))
              ) : (
                <p className="text-center text-muted-foreground">لا يوجد متبرعين حتى الآن</p>
              )}
            </div>
          </ScrollArea>

        </div>

      </div>

      {/* الحملات المشابهة */}
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