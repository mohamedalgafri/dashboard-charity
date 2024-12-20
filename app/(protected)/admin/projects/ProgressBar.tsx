// components/ProgressBar.tsx
export function ProgressBar({ 
    currentAmount, 
    targetAmount 
  }: { 
    currentAmount: number; 
    targetAmount: number; 
  }) {
    const percentage = Math.min((currentAmount / targetAmount) * 100, 100);
  
    return (
      <div className="space-y-1">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>{currentAmount.toLocaleString()} د.أ</span>
          <span>{targetAmount.toLocaleString()} د.أ</span>
        </div>
      </div>
    );
  }