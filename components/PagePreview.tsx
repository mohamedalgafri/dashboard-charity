"use client";

import Image from "next/image";
import Head from "next/head";

interface Input {
  id?: number;
  label: string;
  type: string;
  value?: string;
}

interface Section {
  id?: number;
  title?: string;
  content?: string;
  contentType?: "editor" | "html";
  layoutType?: "text-only" | "text-image" | "image-text" | "text-below-image" | "image-below-text";
  image?: string;
  isVisible?: boolean;
  showBgColor?: boolean;
  bgColor?: string;
  inputs?: Input[];
}

interface Page {
  title: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  headerTitle?: string;
  headerDescription?: string;
  showHeader?: boolean;
  isPublished?: boolean;
  sections?: Section[];
}

export const PagePreview = ({
  data,
  isPreview = false,
}: {
  data: Page;
  isPreview?: boolean;
}) => {
  // Helper function to get input value by label
  const getInputValue = (section: any, label: string) => {
    if (isPreview) {
      return section[label] || "";
    }
    return section.inputs?.find((input: any) => input.label === label)?.value || "";
  };

  // Helper function to render content based on type
  const renderContent = (section: Section) => {
    const content = getInputValue(section, "content");
    return section.contentType === "html" ? (
      <div 
        className="custom-html-content"
        dangerouslySetInnerHTML={{ __html: content }} 
      />
    ) : (
      <div
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  // Helper function to render image
  const renderImage = (section: Section) => {
    const imageUrl = getInputValue(section, "image");
    if (!imageUrl) return null;

    return (
      <div className="relative">
        <Image
          src={imageUrl}
          alt={section.title || "صورة القسم"}
          width={800}
          height={400}
          className="w-full rounded-lg object-cover"
        />
      </div>
    );
  };

  // Helper function to render section based on layout type
  const renderSection = (section: Section) => {
    const content = renderContent(section);
    const image = renderImage(section);

    switch (section.layoutType) {
      case "text-image":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>{content}</div>
            <div className="flex items-center">{image}</div>
          </div>
        );
      case "image-text":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center">{image}</div>
            <div>{content}</div>
          </div>
        );
      case "text-below-image":
        return (
          <div className="space-y-6">
            {image}
            {content}
          </div>
        );
      case "image-below-text":
        return (
          <div className="space-y-6">
            {content}
            {image}
          </div>
        );
      default: // text-only or undefined
        return content;
    }
  };

  return (
    <>
      {!isPreview && (
        <Head>
          <title>{data.metaTitle || data.title}</title>
          <meta name="description" content={data.metaDescription || data.description || ''} />
        </Head>
      )}

      <div className=" py-6 lg:py-12">
        <style jsx global>{`
          .preview-content {
            white-space: pre-wrap;
          }
          .preview-content p {
            white-space: pre-wrap;
            margin-bottom: 1px;
          }
          .preview-content div {
            white-space: pre-wrap;
          }
          .ql-align-center {
            text-align: center;
          }
          .ql-align-right {
            text-align: right;
          }
          .ql-align-left {
            text-align: left;
          }
          .ql-align-justify {
            text-align: justify;
          }
          .custom-html-content {
            width: 100%;
            overflow: hidden;
          }
          .custom-html-content * {
            max-width: 100%;
          }
        `}</style>

        {data.showHeader && (
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">
              {data.headerTitle || data.title}
            </h1>
            {data.headerDescription && (
              <p className="text-xl">{data.headerDescription}</p>
            )}
          </div>
        )}

        <div className="prose text-content max-w-none dark:prose-invert">
          {data.sections?.map((section, index) => (
            <div
              key={section.id || index}
              className={`mt-8 p-4 rounded-lg ${!section.isVisible && "opacity-50"}`}
              style={{ 
                backgroundColor: section.showBgColor ? (section.bgColor || 'transparent') : 'transparent'
              }}
            >
              {section.title && <h2>{section.title}</h2>}
              {renderSection(section)}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};