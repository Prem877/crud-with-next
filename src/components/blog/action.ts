"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function ensureUser() {
  // First, try to find an existing user
  let user = await prisma.user.findFirst();

  return user;
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const published = formData.get("published") === "on";

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    // Ensure we have a user to associate with the post
    const user = await ensureUser();
    await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        slug,
        published,
        authorId: user?.id || "9b21bbd1-fa26-49c4-be04-567f8b87e67f", // Explicitly set authorId to undefined if user.id is not available
      },
    });

    revalidatePath("/blog");
    return { success: true };
    // redirect("/blog");
  } catch (error) {
    // throw new Error("Failed to create post");
    console.log(error);
  }
}

export async function updatePost(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const published = formData.get("published") === "on";

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        published,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${id}`);
    redirect("/blog");
  } catch (error) {
    // throw new Error("Failed to update post");
    console.log(error);
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/blog");
  } catch (error) {
    // throw new Error("Failed to delete post");
    console.log(error);
  }
}
