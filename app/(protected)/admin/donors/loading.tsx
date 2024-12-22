// components/TableLoading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function TableLoading() {
  return (
    <div className="space-y-4">
      {/* قسم البحث والفلترة */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>

      {/* هيكل الجدول */}
      <div className="rounded-md border">
        {/* رأس الجدول */}
        <div className="grid grid-cols-5 gap-4 border-b p-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>

        {/* صفوف الجدول */}
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-5 gap-4 border-b p-4 last:border-0"
          >
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </div>

      {/* الترقيم والتصفح */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[100px]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-[70px]" />
          <Skeleton className="h-8 w-[100px]" />
          <Skeleton className="h-8 w-[70px]" />
        </div>
      </div>
    </div>
  );
}