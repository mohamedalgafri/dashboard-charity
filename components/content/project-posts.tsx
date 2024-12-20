import { ProjectCard } from "./project-card";
import { Project } from "@prisma/client";

interface ProjectPostsProps {
  posts: (Project & {
    blurDataURL: string;
  })[];
}

export function ProjectPosts({ posts }: ProjectPostsProps) {
  if (!posts.length) {
    return <div>No projects found</div>;
  }

  return (
    <main className="space-y-8 mt-10">
      {posts[0] && <ProjectCard data={posts[0]} horizontale priority />}
      
      {posts.length > 1 && (
        <div className="grid gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-10 xl:grid-cols-3">
          {posts.slice(1).map((post, idx) => (
            <ProjectCard 
              key={post.id} 
              data={post} 
              priority={idx <= 2} 
            />
          ))}
        </div>
      )}
    </main>
  );
}