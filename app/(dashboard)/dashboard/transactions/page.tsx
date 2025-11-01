import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateTransactionDialog } from "@/components/transactions/create-transaction-dialog";
import { TransactionItem } from "@/components/transactions/transaction-item";
import { format } from "date-fns";

type TransactionWithRelations = {
  id: string;
  userId: string;
  walletId: string;
  categoryId: string | null;
  type: string;
  amount: number;
  description: string | null;
  date: Date;
  tags: string[];
  attachment: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    emoji: string | null;
    type: string;
    color: string | null;
  } | null;
  wallet: {
    id: string;
    name: string;
    icon: string | null;
  };
};

async function getTransactions(userId: string): Promise<TransactionWithRelations[]> {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: {
      category: true,
      wallet: {
        select: {
          id: true,
          name: true,
          icon: true,
        },
      },
    },
    orderBy: { date: "desc" },
    take: 100,
  });

  // Convert Decimal to number for Client Component serialization
  return transactions.map((transaction: any): TransactionWithRelations => ({
    ...transaction,
    amount: Number(transaction.amount),
  }));
}

async function getWallets(userId: string) {
  return await prisma.wallet.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      icon: true,
    },
  });
}

async function getCategories(userId: string) {
  return await prisma.category.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      emoji: true,
      type: true,
    },
  });
}

export default async function TransactionsPage() {
  const user = await getCurrentUser();
  const transactions = await getTransactions(user!.id);
  const wallets = await getWallets(user!.id);
  const categories = await getCategories(user!.id);

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const dateKey = format(new Date(transaction.date), "MMMM d, yyyy");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(transaction);
    return acc;
  }, {} as Record<string, TransactionWithRelations[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">
            Track all your income and expenses
          </p>
        </div>
        <CreateTransactionDialog wallets={wallets} categories={categories}>
          <Button>sadfasdfs
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </CreateTransactionDialog>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedTransactions).length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first transaction to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedTransactions).map(([date, items]) => (
            <div key={date}>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                {date}
              </h3>
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {items.map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        wallets={wallets}
                        categories={categories}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
