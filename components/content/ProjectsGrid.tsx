"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <div className="relative h-48 w-full">
                <img
                  src={project.coverImage || '/placeholder.jpg'} // إضافة صورة احتياطية
                  alt={project.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${project.targetAmount ? Math.min(
                          (project.currentAmount / project.targetAmount) * 100,
                          100
                        ) : 0}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {project.targetAmount ? 
                        `${Math.round((project.currentAmount / project.targetAmount) * 100)}%` 
                        : '0%'} تم جمعه
                    </span>
                    <span className="font-medium">
                      {project.currentAmount.toLocaleString()} / {project.targetAmount?.toLocaleString() ?? 0} ريال
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}