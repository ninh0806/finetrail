import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateWalletDialog } from "@/components/wallets/create-wallet-dialog";

async function getWallets(userId: string) {
  const wallets = await prisma.wallet.findMany({
    where: { userId },
    include: {
      transactions: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return wallets.map((wallet) => {
    const balance = wallet.transactions.reduce((acc, transaction) => {
      if (transaction.type === "income") {
        return acc + Number(transaction.amount);
      } else {
        return acc - Number(transaction.amount);
      }
    }, Number(wallet.initialAmount));

    return {
      ...wallet,
      currentBalance: balance,
      transactionCount: wallet.transactions.length,
    };
  });
}

export default async function WalletsPage() {
  const user = await getCurrentUser();
  const wallets = await getWallets(user!.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Wallets</h2>
          <p className="text-muted-foreground">
            Manage your wallets and accounts
          </p>
        </div>
        <CreateWalletDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Wallet
          </Button>
        </CreateWalletDialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wallets.map((wallet) => (
          <Card key={wallet.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                  style={{ backgroundColor: wallet.color || "#6366f1" }}
                >
                  {wallet.icon || "💳"}
                </div>
                <div>
                  <CardTitle className="text-lg">{wallet.name}</CardTitle>
                  <p className="text-xs text-muted-foreground capitalize">
                    {wallet.type.replace("_", " ")}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Current Balance</p>
                  <p className="text-2xl font-bold">
                    {wallet.currency} {wallet.currentBalance.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transactions</span>
                  <span className="font-medium">{wallet.transactionCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Initial Amount</span>
                  <span className="font-medium">
                    {wallet.currency} {Number(wallet.initialAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {wallets.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No wallets yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first wallet to get started
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
