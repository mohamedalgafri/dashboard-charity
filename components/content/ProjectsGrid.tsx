"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import DonationProgress from "./DonationProgress";

interface Project {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  targetAmount: number | null;
  currentAmount: number;  // تغيير من raisedAmount إلى currentAmount
}

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link href={`/projects/${project.slug}`} key={project.id}>
              <Card className="h-full overflow-hidden">
                <div className="relative h-40">
                  {project.coverImage ? (
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>
                <CardHeader className="pb-0 pt-3 min-h-[85px]">
                  <CardTitle className="text-lg line-clamp-1">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DonationProgress
                    className="mt-0"
                    currentAmount={project.currentAmount}
                    targetAmount={project.targetAmount}
                  />
                </CardContent>
              </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}