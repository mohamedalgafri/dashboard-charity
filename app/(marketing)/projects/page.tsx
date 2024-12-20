import { ProjectPosts } from "@/components/content/project-posts"
import { db as prisma } from "@/lib/db"
import { Project } from "@prisma/client";

export const revalidate = 5;

import { constructMetadata, getBlurDataURL } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Project – Next Template",
  description: "Project Page",
});

export default async function ProjectPage() {

  const data : Project[] =  await prisma.project.findMany({
    orderBy:{createdAt:'desc'}
  });

  const projects = await Promise.all(
    data
      .map(async (post) => ({
        ...post,
        blurDataURL: await getBlurDataURL(post.image),
      })),
  );

  return <ProjectPosts posts={projects} />;
}