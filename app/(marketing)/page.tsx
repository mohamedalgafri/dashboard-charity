// app/page.tsx

import DonationForm from "@/components/forms/DonationForm";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { db } from "@/lib/db";
import ProjectsSlider from "@/components/content/ProjectsSlider";
import { getProjects } from "@/actions/project";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProjectCoverSlider from "@/components/sections/project-cover-slider";

export const revalidate = 5;

export default async function IndexPage() {
  // جلب الحملات التي لديها صور غلاف
  const projectsWithCovers = await db.project.findMany({
    where: {
      isPublished: true,
      coverImage: {
        not: null
      }
    },
    select: {
      id: true,
      title: true,
      coverImage: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const projects = await getProjects();

  // جلب الحملات المتاحة للتبرع
  const availableProjects = await db.project.findMany({
    where: {
      isPublished: true,
      targetAmount: {
        gt: db.project.fields.currentAmount
      }
    },
    select: {
      id: true,
      title: true
    }
  });

  return (
    <>
      <MaxWidthWrapper className="min-h-screen relative">
        <div className="home-header">
          <div className="header-slider flex items-center w-full gap-8">
            <div className="rightHeader flex-1">
              <h1 className="text-2xl lg:text-4xl text-white">مؤسسة العطاء </h1>
              <p className="md:text-lg mt-3 md:mt-5 text-white">معًا نبني مستقبلاً مشرقًا عبر نشر روح التكافل والعطاء. كن جزءًا من التغيير وساهم معنا في دعم المحتاجين وتحقيق الأثر المستدام.</p>
              <Button className="w-28 mt-3">
                <Link href="#donate">
                  تبرع الان
                </Link>
              </Button>
            </div>
            <div className="leftHeader flex-1 relative">
              <ProjectCoverSlider projects={projectsWithCovers} />
            </div>
          </div>
        </div>

      {projects && projects.length > 0 && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold mb-6">الحملات</h2>
            <Button>
              <Link href={'/projects'}>
                جميع الحملات
              </Link>
            </Button>
          </div>
          <ProjectsSlider projects={projects}/>
        </div>
      )}

        

        {availableProjects.length > 0 ? (
          <section className="py-16" id="donate">
            <div className="max-w-xl mx-auto">
              <DonationForm 
                projects={availableProjects} 
                className="shadow-lg"
              />
            </div>
          </section>
        ) : (
          <section className="py-16 text-center">
            <div className="max-w-xl mx-auto">
              <p className="text-gray-600">لا توجد مشاريع متاحة للتبرع حالياً</p>
            </div>
          </section>
        )}
      </MaxWidthWrapper>
    </>
  );
}


