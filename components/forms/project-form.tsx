"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createProject } from "@/actions/project-actions";
import { useState } from "react";

const FormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description is required"),
  image: z
    .instanceof(File)
    .optional()
    .refine((file) => file && file.size < 5 * 1024 * 1024, "Image must be smaller than 5MB"),
});

export function ProjectForm() {
  const [isLoading, setIsLoading] = useState(false); // الحالة للتحميل

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      image: undefined,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true); // بداية التحميل
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);

      if (data.image) {
        formData.append("file", data.image);
        formData.append("folder", "projects");  
        formData.append("resourceType", "image"); 
      }

      // رفع الصورة إلى API الخاص بـ Cloudinary
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        const imageUrl = responseData.url;

        // تمرير البيانات إلى createProject
        const projectData = {
          title: data.title,
          description: data.description,
          imageUrl: imageUrl,
        };

        await createProject(projectData);

        form.reset(); // إعادة تعيين المدخلات
        toast.success("Project created successfully!");
      } else {
        console.error("Failed to upload image:", responseData);
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    } finally {
      setIsLoading(false); // إنهاء التحميل
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2 sm:max-w-sm">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="rounded-lg px-4"
                  placeholder="Project Title"
                  {...field}
                  disabled={isLoading} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="rounded-lg px-4"
                  placeholder="Project Description"
                  {...field}
                  disabled={isLoading} // تعطيل المدخل أثناء التحميل
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  className="rounded-lg px-4"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      field.onChange(e.target.files[0]);
                    }
                  }}
                  disabled={isLoading} // تعطيل رفع الصورة أثناء التحميل
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="sm" rounded="lg" className="px-4" disabled={isLoading}>
          {isLoading ? "Loading..." : "Add"}
        </Button>
      </form>
    </Form>
  );
}
