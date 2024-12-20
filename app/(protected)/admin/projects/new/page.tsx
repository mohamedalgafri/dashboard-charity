// app/(dashboard)/dashboard/projects/new/page.tsx
import { ProjectForm } from '@/components/forms/ProjectForm';

export default function NewProjectPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">إنشاء مشروع جديد</h1>
      <ProjectForm />
    </div>
  );
}