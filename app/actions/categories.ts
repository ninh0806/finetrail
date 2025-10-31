"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function createCategory(data: {
  name: string;
  type: string;
  color: string;
  emoji: string;
}) {
  const user = await requireAuth();

  const category = await prisma.category.create({
    data: {
      userId: user.id,
      name: data.name,
      type: data.type,
      color: data.color,
      emoji: data.emoji,
      isDefault: false,
    },
  });

  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard");

  return category;
}

export async function deleteCategory(categoryId: string) {
  const user = await requireAuth();

  await prisma.category.delete({
    where: {
      id: categoryId,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard");
}
