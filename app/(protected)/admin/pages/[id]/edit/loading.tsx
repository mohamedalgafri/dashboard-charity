import { Skeleton } from "@/components/ui/skeleton";

export default function PageFormSkeleton() {
 return (
   <div className="mx-auto w-full">
     <div className="rounded-lg border bg-card">
       <div className="p-6 space-y-8">
         {/* Header */}
         <Skeleton className="h-8 w-48" />

         {/* Basic Info */}
         <div className="space-y-4">
           <Skeleton className="h-6 w-24" />
           <Skeleton className="h-10 w-full" />
           <Skeleton className="h-6 w-24" />
           <Skeleton className="h-28 w-full" />
         </div>

         {/* SEO Section */}
         <div className="space-y-4">
           <Skeleton className="h-6 w-32" />
           <Skeleton className="h-10 w-full" />
           <Skeleton className="h-28 w-full" />
         </div>

         {/* Header Section */}
         <div className="space-y-4">
           <div className="flex items-center gap-2">
             <Skeleton className="h-5 w-5" />
             <Skeleton className="h-6 w-32" />
           </div>
           <Skeleton className="h-10 w-full" />
           <Skeleton className="h-28 w-full" />
         </div>

         {/* Sections */}
         <div className="space-y-6">
           <Skeleton className="h-6 w-32" />
           {[1, 2].map(i => (
             <div key={i} className="space-y-4 p-4 border rounded-lg">
               <div className="grid grid-cols-2 gap-4">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
               </div>
               <Skeleton className="h-48 w-full" />
             </div>
           ))}
         </div>

         {/* Buttons */}
         <div className="flex justify-end gap-2 pt-6">
           <Skeleton className="h-10 w-24" />
           <Skeleton className="h-10 w-32" />
         </div>

         {/* Preview */}
         <div className="mt-8 pt-8 border-t space-y-4">
           <Skeleton className="h-8 w-36" />
           <Skeleton className="h-[400px] w-full rounded-xl" />
         </div>
       </div>
     </div>
   </div>
 );
}