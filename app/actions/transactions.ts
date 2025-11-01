"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function createTransaction(data: {
  type: string;
  amount: number;
  description: string;
  walletId: string;
  categoryId: string | null;
  date: Date;
  tags: string[];
}) {
  const user = await requireAuth();

  const transaction = await prisma.transaction.create({
    data: {
      userId: user.id,
      type: data.type,
      amount: data.amount,
      description: data.description,
      walletId: data.walletId,
      categoryId: data.categoryId,
      date: data.date,
      tags: data.tags,
    },
  });

  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/wallets");

  return transaction;
}

export async function updateTransaction(
  transactionId: string,
  data: {
    type: string;
    amount: number;
    description: string;
    walletId: string;
    categoryId: string | null;
    date: Date;
    tags: string[];
  }
) {
  const user = await requireAuth();

  const transaction = await prisma.transaction.update({
    where: {
      id: transactionId,
      userId: user.id,
    },
    data: {
      type: data.type,
      amount: data.amount,
      description: data.description,
      walletId: data.walletId,
      categoryId: data.categoryId,
      date: data.date,
      tags: data.tags,
    },
  });

  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/wallets");

  return transaction;
}

export async function deleteTransaction(transactionId: string) {
  const user = await requireAuth();

  await prisma.transaction.delete({
    where: {
      id: transactionId,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/wallets");
}
