"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface DonationProgressProps {
  currentAmount: number;
  targetAmount: number;
  className?: string;
}

const DonationProgress = ({
  currentAmount,
  targetAmount,
  className,
}: DonationProgressProps) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isAdmin = session?.user?.role === "ADMIN";
  const isAdminDashboard = pathname.startsWith('/admin');

  const percentage = Math.min(
    Math.round((currentAmount / (targetAmount || 1)) * 100),
    100
  );

  const isCompleted = currentAmount >= targetAmount;
  const displayAmount = isCompleted ? targetAmount : currentAmount;
  const surplus = currentAmount - targetAmount;

  return (
    <div className={cn("space-y-2", className)}>
      <Progress
        value={percentage}
        className={cn(
          "h-2.5",
          isCompleted && "bg-green-100 [&>div]:bg-green-500"
        )}
        style={{ direction: 'rtl' }}
      />
      <div className="flex justify-between text-sm">
        <span className={cn(
          "text-gray-600",
          isCompleted && "text-green-600 font-medium"
        )}>
          {isCompleted ? "مكتمل" : `${percentage}% تم جمعه`}
        </span>
        <span className="font-medium">
          ${Math.floor(displayAmount).toLocaleString('en-US')}
          {!isCompleted && ` / $${Math.floor(targetAmount).toLocaleString('en-US')}`}
        </span>
      </div>
      {isCompleted && isAdmin && isAdminDashboard && surplus > 0 && (
        <div className="text-sm text-green-600">
           تم جمع زيادة بقيمة ${surplus}
        </div>
      )}
    </div>
  );
};

export default DonationProgress;