// app/(dashboard)/dashboard/projects/new/page.tsx

import { ProjectForm } from "@/components/forms/ProjectForm";


export default function NewProjectPage() {
  return (
    <div className="mx-auto py-8 w-full">
      <ProjectForm mode="create" />
    </div>
  );
}