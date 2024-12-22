import { DashboardHeader } from "@/components/dashboard/header";
import { SkeletonSection } from "@/components/shared/section-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSettingsLoading() {
  return (
    <>
      <Skeleton className="h-10 w-60 rounded-lg" />
      <div className="divide-y divide-muted pb-10">
        <SkeletonSection />
        {/* <SkeletonSection /> */}
        {/* <SkeletonSection card /> */}
      </div>
    </>
  );
}
