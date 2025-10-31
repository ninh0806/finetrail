"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-helpers";

export async function createWallet(data: {
  name: string;
  type: string;
  currency: string;
  color: string;
  icon: string;
  initialAmount: number;
}) {
  const user = await requireAuth();

  const wallet = await prisma.wallet.create({
    data: {
      userId: user.id,
      name: data.name,
      type: data.type,
      currency: data.currency,
      color: data.color,
      icon: data.icon,
      initialAmount: data.initialAmount,
    },
  });

  revalidatePath("/dashboard/wallets");
  revalidatePath("/dashboard");

  return wallet;
}

export async function deleteWallet(walletId: string) {
  const user = await requireAuth();

  await prisma.wallet.delete({
    where: {
      id: walletId,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard/wallets");
  revalidatePath("/dashboard");
}
