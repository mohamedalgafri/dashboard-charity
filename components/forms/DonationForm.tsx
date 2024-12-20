"use client";


import { Project } from '@prisma/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface DonationFormProps {
  projectId?: number;
  projects?: Project[];
  defaultAmount?: number;
}

export function DonationForm({ projectId, projects, defaultAmount }: DonationFormProps) {
  const [selectedProject, setSelectedProject] = useState(projectId);
  const { register, handleSubmit } = useForm();

  return (
    <form className="space-y-4 p-6 bg-white rounded-lg shadow">
      {!projectId && projects && (
        <select 
          className="w-full p-2 border rounded"
          onChange={(e) => setSelectedProject(Number(e.target.value))}
        >
          <option value="">اختر المشروع</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      )}
      
      <input
        type="number"
        placeholder="مبلغ التبرع"
        defaultValue={defaultAmount}
        className="w-full p-2 border rounded"
        {...register('amount', { required: true, min: 1 })}
      />
      
      <input
        type="text"
        placeholder="الاسم"
        className="w-full p-2 border rounded"
        {...register('donorName', { required: true })}
      />
      
      <input
        type="email"
        placeholder="البريد الإلكتروني"
        className="w-full p-2 border rounded"
        {...register('email')}
      />
      
      <textarea
        placeholder="رسالة (اختياري)"
        className="w-full p-2 border rounded"
        {...register('message')}
      />
      
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('anonymous')}
        />
        <label>تبرع مجهول</label>
      </div>
      
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        تبرع الآن
      </button>
    </form>
  );
}