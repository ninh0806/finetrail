"use client";

import { format } from "date-fns";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditTransactionSheet } from "@/components/transactions/edit-transaction-sheet";
import { DeleteTransactionAlert } from "@/components/transactions/delete-transaction-alert";

interface Category {
  id: string;
  name: string;
  emoji: string | null;
  type: string;
  color: string | null;
}

interface Wallet {
  id: string;
  name: string;
  icon: string | null;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  date: Date;
  tags: string[];
  walletId: string;
  categoryId: string | null;
  category: Category | null;
  wallet: Wallet;
}

interface TransactionItemProps {
  transaction: Transaction;
  wallets: Wallet[];
  categories: Array<{
    id: string;
    name: string;
    emoji: string | null;
    type: string;
  }>;
}

export function TransactionItem({
  transaction,
  wallets,
  categories,
}: TransactionItemProps) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
          style={{
            backgroundColor: transaction.category?.color || "#64748b",
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
      <div className="flex items-center gap-2">
        <div className="text-right">
          <p
            className={`text-lg font-semibold ${
              transaction.type === "income" ? "text-green-600" : "text-red-600"
            }`}
          >
            {transaction.type === "income" ? "+" : "-"}$
            {transaction.amount.toFixed(2)}
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
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </EditTransactionSheet>
            <DeleteTransactionAlert transactionId={transaction.id}>
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
    </div>
  );
}
