
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectFormSkeleton() {
 return (
   <div className="mx-auto w-full">
     <div className="rounded-lg border bg-card">
       <div className="p-6 space-y-6">
         {/* العنوان */}
         <Skeleton className="h-8 w-48" />

         {/* معلومات أساسية */}
         <div className="space-y-4">
           <Skeleton className="h-6 w-24" />
           <Skeleton className="h-10 w-full" />
           <Skeleton className="h-6 w-24" />
           <Skeleton className="h-28 w-full" />
           <div className="grid grid-cols-2 gap-4">
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
           </div>
         </div>

         {/* الصور */}
         <div className="space-y-4">
           <Skeleton className="h-6 w-24" />
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Skeleton className="h-48 w-full" />
             <Skeleton className="h-48 w-full" />
           </div>
         </div>

         {/* محرر النص */}
         <div className="space-y-4">
           <Skeleton className="h-6 w-24" />
           <Skeleton className="h-64 w-full" />
         </div>

         {/* أزرار */}
         <div className="flex items-center justify-between">
           <Skeleton className="h-10 w-24" />
           <Skeleton className="h-10 w-32" />
         </div>
       </div>
     </div>
   </div>
 );
}