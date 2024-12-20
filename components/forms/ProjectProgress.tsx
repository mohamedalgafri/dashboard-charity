// components/ProjectProgress.tsx
interface ProjectProgressProps {
    currentAmount: number;
    targetAmount: number;
  }
  
  export function ProjectProgress({ currentAmount, targetAmount }: ProjectProgressProps) {
    const percentage = Math.min((currentAmount / targetAmount) * 100, 100);
    
    return (
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-green-600 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm">
          <span>المبلغ المتوفر: {currentAmount} د.أ</span>
          <span>المبلغ المستهدف: {targetAmount} د.أ</span>
        </div>
      </div>
    );
  }