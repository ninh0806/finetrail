import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

async function getDashboardData(userId: string) {
  const wallets = await prisma.wallet.findMany({
    where: { userId },
    include: {
      transactions: true,
    },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 10,
    include: {
      category: true,
      wallet: true,
    },
  });

  const totalIncome = await prisma.transaction.aggregate({
    where: {
      userId,
      type: "income",
    },
    _sum: {
      amount: true,
    },
  });

  const totalExpense = await prisma.transaction.aggregate({
    where: {
      userId,
      type: "expense",
    },
    _sum: {
      amount: true,
    },
  });

  const totalBalance = wallets.reduce((sum, wallet) => {
    const walletBalance = wallet.transactions.reduce((acc, transaction) => {
      if (transaction.type === "income") {
        return acc + Number(transaction.amount);
      } else {
        return acc - Number(transaction.amount);
      }
    }, Number(wallet.initialAmount));
    return sum + walletBalance;
  }, 0);

  return {
    wallets,
    transactions,
    stats: {
      totalBalance,
      totalIncome: Number(totalIncome._sum.amount || 0),
      totalExpense: Number(totalExpense._sum.amount || 0),
    },
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const data = await getDashboardData(user!.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || "User"}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.stats.totalBalance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {data.wallets.length} wallets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${data.stats.totalIncome.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${data.stats.totalExpense.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(data.stats.totalIncome - data.stats.totalExpense).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.stats.totalIncome > 0
                ? `${(((data.stats.totalIncome - data.stats.totalExpense) / data.stats.totalIncome) * 100).toFixed(1)}% saved`
                : "No income yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.transactions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No transactions yet</p>
              ) : (
                data.transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {transaction.category?.emoji || "💰"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {transaction.description || "No description"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.category?.name || "Uncategorized"} •{" "}
                          {transaction.wallet.name}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {Number(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.wallets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No wallets yet</p>
              ) : (
                data.wallets.map((wallet) => {
                  const balance = wallet.transactions.reduce((acc, transaction) => {
                    if (transaction.type === "income") {
                      return acc + Number(transaction.amount);
                    } else {
                      return acc - Number(transaction.amount);
                    }
                  }, Number(wallet.initialAmount));

                  return (
                    <div
                      key={wallet.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: wallet.color || "#6366f1" }}
                        >
                          <span className="text-lg">{wallet.icon || "💳"}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{wallet.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {wallet.type.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        ${balance.toFixed(2)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
