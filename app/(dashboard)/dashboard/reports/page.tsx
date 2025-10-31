import { Card, CardContent } from "@/components/ui/card";
import { PieChart } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Advanced analytics and insights coming soon
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <PieChart className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Reports & Analytics</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Detailed reports with charts, filters, and export functionality will be available here.
            Track your spending patterns, compare periods, and generate PDF reports.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
