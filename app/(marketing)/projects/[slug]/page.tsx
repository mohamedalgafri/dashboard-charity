// pages/projects/[slug].tsx
import { DonationForm } from '@/components/forms/DonationForm';
import { ProjectProgress } from '@/components/forms/ProjectProgress';
import { GetStaticProps, GetStaticPaths } from 'next';

import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function ProjectPage({ project }) {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
          
          <div className="mb-6">
            <img 
              src={project.coverImage} 
              alt={project.title}
              className="w-full rounded-lg"
            />
          </div>
          
          <ProjectProgress
            currentAmount={project.currentAmount}
            targetAmount={project.targetAmount}
          />
          
          <div className="prose max-w-none mt-8">
            <Editor
              value={project.content}
              readOnly
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-8">
            {project.images.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt=""
                className="rounded-lg"
              />
            ))}
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="sticky top-8">
            <DonationForm projectId={project.id} />
          </div>
        </div>
      </div>
    </div>
  );
}