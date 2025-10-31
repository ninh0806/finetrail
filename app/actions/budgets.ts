"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function createBudget(data: {
  categoryId: string;
  amount: number;
  period: string;
  startDate: Date;
  endDate: Date;
}) {
  const user = await requireAuth();

  const budget = await prisma.budget.create({
    data: {
      userId: user.id,
      categoryId: data.categoryId,
      amount: data.amount,
      period: data.period,
      startDate: data.startDate,
      endDate: data.endDate,
    },
  });

  revalidatePath("/dashboard/budgets");

  return budget;
}

export async function deleteBudget(budgetId: string) {
  const user = await requireAuth();

  await prisma.budget.delete({
    where: {
      id: budgetId,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/budgets");
}
