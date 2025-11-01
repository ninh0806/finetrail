import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateTransactionDialog } from "@/components/transactions/create-transaction-dialog";
import { EditTransactionSheet } from "@/components/transactions/edit-transaction-sheet";
import { DeleteTransactionAlert } from "@/components/transactions/delete-transaction-alert";
import { format } from "date-fns";

async function getTransactions(userId: string) {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: {
      category: true,
      wallet: true,
    },
    orderBy: { date: "desc" },
    take: 100,
  });

  return transactions;
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
  }, {} as Record<string, typeof transactions>);

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
          <Button>
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
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                            style={{
                              backgroundColor:
                                transaction.category?.color || "#64748b",
                            }}
                          >
                            {transaction.category?.emoji || "📝"}
                          </div>
                          <div>
                            <p className="font-medium">
                              {transaction.description || "No description"}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{transaction.category?.name || "Uncategorized"}</span>
                              <span>•</span>
                              <span>{transaction.wallet.name}</span>
                              {transaction.tags.length > 0 && (
                                <>
                                  <span>•</span>
                                  <div className="flex gap-1">
                                    {transaction.tags.slice(0, 2).map((tag) => (
                                      <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-semibold ${
                              transaction.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}$
                            {Number(transaction.amount).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(transaction.date), "h:mm a")}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <EditTransactionSheet
                              transaction={transaction}
                              wallets={wallets}
                              categories={categories}
                            >
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </EditTransactionSheet>
                            <DeleteTransactionAlert
                              transactionId={transaction.id}
                            >
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-red-600"
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DeleteTransactionAlert>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
