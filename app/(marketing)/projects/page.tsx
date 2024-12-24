// app/(marketing)/projects/page.tsx
// import { ProjectPosts } from "@/components/content/project-posts"
// import { db as prisma } from "@/lib/db"
// import { Project } from "@prisma/client";
// import { constructMetadata, getBlurDataURL } from "@/lib/utils";

import { getProjects } from "@/actions/project";
import ProjectsGrid from "@/components/content/ProjectsGrid";



export const revalidate = 5;

// export const metadata = constructMetadata({
//   title: "Project – Next Template",
//   description: "Project Page",
// });


export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
        <div className="mb-12 mt-12 text-center">
            <h1 className="text-4xl font-bold mb-4">
              الحملات
            </h1>
            <p className="text-xl">

            </p>
          </div>
          <ProjectsGrid projects={projects} />
    </>
  )

}
