
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { BarChart2, TrendingUp, AlertCircle } from "lucide-react";

const Index = () => {
  const stats = [
    {
      title: "Total VAT Due",
      value: "₦125,000",
      change: "+12.5%",
      icon: BarChart2,
      trend: "up",
    },
    {
      title: "Corporate Tax Estimate",
      value: "₦450,000",
      change: "+8.2%",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Pending Returns",
      value: "2",
      change: "Due in 15 days",
      icon: AlertCircle,
      trend: "neutral",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-accent-dark mb-2">Dashboard</h1>
          <p className="text-accent-light">
            Welcome back. Here's your tax overview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-accent-light">{stat.title}</p>
                  <p className="text-2xl font-bold text-accent-dark mt-2">
                    {stat.value}
                  </p>
                  <p className={`text-sm mt-2 ${
                    stat.trend === "up" ? "text-green-500" : "text-accent-light"
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-accent-dark mb-4">
            Recent Transactions
          </h2>
          <p className="text-accent-light">
            Your recent transactions will appear here.
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
