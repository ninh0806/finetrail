import { getCurrentUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { CreateCategoryDialog } from "@/components/categories/create-category-dialog";

async function getCategories(userId: string) {
  const categories = await prisma.category.findMany({
    where: { userId },
    include: {
      transactions: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return categories.map((category) => ({
    ...category,
    transactionCount: category.transactions.length,
    totalAmount: category.transactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    ),
  }));
}

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  const categories = await getCategories(user!.id);

  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Organize your transactions with categories
          </p>
        </div>
        <CreateCategoryDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </CreateCategoryDialog>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="mb-4 text-xl font-semibold">Expense Categories</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {expenseCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                      style={{ backgroundColor: category.color || "#64748b" }}
                    >
                      {category.emoji || "📝"}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      {category.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transactions</span>
                      <span className="font-medium">
                        {category.transactionCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span className="font-medium text-red-600">
                        ${category.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {expenseCategories.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No expense categories yet
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-semibold">Income Categories</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {incomeCategories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                      style={{ backgroundColor: category.color || "#64748b" }}
                    >
                      {category.emoji || "📝"}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      {category.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transactions</span>
                      <span className="font-medium">
                        {category.transactionCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Amount</span>
                      <span className="font-medium text-green-600">
                        ${category.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {incomeCategories.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No income categories yet
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
