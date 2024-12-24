// components/project/project-basic-info.tsx
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { ProjectFormValues } from '@/schemas/project-schema';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface ProjectBasicInfoProps {
  register: UseFormRegister<ProjectFormValues>;
  errors: FieldErrors<ProjectFormValues>;
  loading?: boolean;
}

export function ProjectBasicInfo({ register, errors, loading }: ProjectBasicInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <Label htmlFor="title ">عنوان الحملة *</Label>
        <Input
          id="title"
          {...register("title")}
          disabled={loading}
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="description">الوصف المختصر</Label>
        <Textarea
          id="description"
          {...register("description")}
          disabled={loading}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="targetAmount">المبلغ المستهدف *</Label>
        <Input
          id="targetAmount"
          type="number"
          {...register("targetAmount", { 
            valueAsNumber: true,
            min: { value: 0.01, message: "يجب أن يكون المبلغ أكبر من صفر" }
          })}
          step="0.01"
          min="0.01"
          disabled={loading}
        />
        {errors.targetAmount && (
          <p className="text-red-600 text-sm mt-1">{errors.targetAmount.message}</p>
        )}
      </div>

      <div></div>

      <div>
        <Label htmlFor="startDate">تاريخ البداية</Label>
        <Input
          id="startDate"
          type="date"
          {...register("startDate")}
          disabled={loading}
        />
      </div>

      <div>
        <Label htmlFor="endDate">تاريخ النهاية</Label>
        <Input
          id="endDate"
          type="date"
          {...register("endDate")}
          disabled={loading}
        />
      </div>
    </div>
  );
}