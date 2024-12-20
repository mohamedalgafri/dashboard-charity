// app/(marketing)/projects/page.tsx
import { ProjectPosts } from "@/components/content/project-posts"
import { db as prisma } from "@/lib/db"
import { Project } from "@prisma/client";
import { constructMetadata, getBlurDataURL } from "@/lib/utils";

export const revalidate = 5;

export const metadata = constructMetadata({
  title: "Project – Next Template",
  description: "Project Page",
});

export default async function ProjectPage() {
  try {
    const data: Project[] = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const projects = await Promise.all(
      data.map(async (post) => {
        const blurDataURL = await getBlurDataURL(post.image);
        return {
          ...post,
          blurDataURL,
        };
      })
    );

    return <ProjectPosts posts={projects} />;
  } catch (error) {
    console.error("Error fetching projects:", error);
    // يمكنك إضافة معالجة الخطأ هنا
    return <div>Failed to load projects</div>;
  }
}