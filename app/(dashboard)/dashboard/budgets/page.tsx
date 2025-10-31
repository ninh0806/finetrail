import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { CreateBudgetDialog } from "@/components/budgets/create-budget-dialog";
import { format, isWithinInterval } from "date-fns";

async function getBudgets(userId: string) {
  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: {
      category: {
        include: {
          transactions: {
            where: {
              type: "expense",
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return budgets.map((budget) => {
    const transactions = budget.category?.transactions.filter((t) =>
      isWithinInterval(new Date(t.date), {
        start: budget.startDate,
        end: budget.endDate,
      })
    ) || [];

    const spent = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const percentage = Math.min((spent / Number(budget.amount)) * 100, 100);

    return {
      ...budget,
      spent,
      remaining: Math.max(Number(budget.amount) - spent, 0),
      percentage,
      isExceeded: spent > Number(budget.amount),
    };
  });
}

async function getCategories(userId: string) {
  return await prisma.category.findMany({
    where: { userId, type: "expense" },
  });
}

export default async function BudgetsPage() {
  const user = await getCurrentUser();
  const budgets = await getBudgets(user!.id);
  const categories = await getCategories(user!.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
          <p className="text-muted-foreground">
            Set spending limits and track your progress
          </p>
        </div>
        <CreateBudgetDialog categories={categories}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Budget
          </Button>
        </CreateBudgetDialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {budgets.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No budgets yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first budget to start tracking spending limits
              </p>
            </CardContent>
          </Card>
        ) : (
          budgets.map((budget) => (
            <Card key={budget.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                      style={{
                        backgroundColor: budget.category?.color || "#64748b",
                      }}
                    >
                      {budget.category?.emoji || "📝"}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {budget.category?.name || "General"}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground capitalize">
                        {budget.period}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Spent</span>
                    <span
                      className={`font-medium ${
                        budget.isExceeded ? "text-red-600" : ""
                      }`}
                    >
                      ${budget.spent.toFixed(2)} / ${Number(budget.amount).toFixed(2)}
                    </span>
                  </div>
                  <Progress
                    value={budget.percentage}
                    className={budget.isExceeded ? "bg-red-200" : ""}
                  />
                  {budget.isExceeded ? (
                    <p className="text-xs text-red-600">
                      Over budget by ${(budget.spent - Number(budget.amount)).toFixed(2)}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      ${budget.remaining.toFixed(2)} remaining
                    </p>
                  )}
                </div>
                <div className="pt-2 text-xs text-muted-foreground">
                  {format(budget.startDate, "MMM d, yyyy")} -{" "}
                  {format(budget.endDate, "MMM d, yyyy")}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
