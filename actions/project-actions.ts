"use server";
import { db as prisma } from "@/lib/db";

export async function createProject(data: { title: string; description: string; imageUrl: string }) {
  try {
    const project = await prisma.project.create({
      data: {
        title: data.title,
        description: data.description,
        image: data.imageUrl,
        visble:true,
      },
    });

    console.log("Project created:", project);

    return { success: true, project };
  } catch (error) {
    console.error("Failed to create project:", error);
    throw new Error("Database error");
  }
}
