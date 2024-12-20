
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { PagePreview } from "@/components/PagePreview";
import { Page } from "@/types";


export default async function PagePage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const pageData = await db.page.findFirst({
      where: { 
        slug: params.slug,
        isPublished: true
      },
      include: {
        sections: {
          where: {
            isVisible: true
          },
          orderBy: {
            order: 'asc'
          },
          include: {
            inputs: true,
          },
        },
      },
    });

    if (!pageData) {
      notFound();
    }

    // Transform the data to match the Page interface, converting nulls to undefined
    const page: Page = {
      id: pageData.id,
      title: pageData.title,
      slug: pageData.slug ,
      description: pageData.description ,
      metaTitle: pageData.metaTitle ,
      metaDescription: pageData.metaDescription ,
      headerTitle: pageData.headerTitle ,
      headerDescription: pageData.headerDescription ,
      showHeader: pageData.showHeader ,
      isPublished: pageData.isPublished,
      publishedAt: pageData.publishedAt ,
      createdBy: pageData.createdBy ,
      createdAt: pageData.createdAt,
      updatedAt: pageData.updatedAt,
      sections: pageData.sections.map(section => ({
        id: section.id,
        title: section.title ,
        pageId: section.pageId,
        layoutType: section.layoutType ,
        order: section.order ,
        isVisible: section.isVisible ,
        showBgColor: section.showBgColor ,
        bgColor: section.bgColor ,
        inputs: section.inputs.map(input => ({
          ...input,
          label: input.label ,
          type: input.type ,
          value: input.value 
        })),
        createdAt: section.createdAt,
        updatedAt: section.updatedAt
      })),
    };

    return (
      <MaxWidthWrapper>
        <PagePreview data={page} />
      </MaxWidthWrapper>
    );
  } catch (error) {
    console.error("Error fetching page:", error);
    notFound();
  }
}