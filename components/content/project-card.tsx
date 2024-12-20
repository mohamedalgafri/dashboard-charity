import Image from "next/image";
import Link from "next/link";
import { cn, formatDate, placeholderBlurhash } from "@/lib/utils";
import BlurImage from "../shared/blur-image";
import { Project } from "@prisma/client";

interface ProjectCardProps {
  data: Project & {
    blurDataURL?: string; // جعلها اختيارية
  };
  priority?: boolean;
  horizontale?: boolean;
}

export function ProjectCard({ data, priority, horizontale = false }: ProjectCardProps) {
  return (
    <article
      className={cn(
        "group relative",
        horizontale
          ? "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6"
          : "flex flex-col space-y-2",
      )}
    >
      {data.image && (
        <div className="w-full overflow-hidden rounded-xl border">
          <BlurImage
            alt={data.title}
            blurDataURL={data.blurDataURL || placeholderBlurhash} // استخدام || بدلاً من ??
            className={cn(
              "size-full object-cover object-center",
              horizontale ? "lg:h-72" : null,
            )}
            width={800}
            height={400}
            priority={priority}
            placeholder="blur"
            src={data.image}
            sizes="(max-width: 768px) 750px, 600px"
          />
        </div>
      )}
      <div
        className={cn(
          "flex flex-1 flex-col",
          horizontale ? "justify-center" : "justify-between",
        )}
      >
        <div className="w-full">
          <h2 className="my-1.5 line-clamp-2 font-heading text-2xl">
            {data.title}
          </h2>
          {data.description && (
            <p className="line-clamp-2 text-muted-foreground">
              {data.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}