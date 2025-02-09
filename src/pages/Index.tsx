
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MonoConnectWidget } from "@/components/bank/MonoConnectWidget";
import { Card } from "@/components/ui/card";
import { BarChart2, TrendingUp, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: bankAccounts, refetch: refetchBankAccounts } = useQuery({
    queryKey: ["bankAccounts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bank_accounts")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-accent-dark">
              Bank Accounts
            </h2>
            <MonoConnectWidget onSuccess={refetchBankAccounts} />
          </div>
          
          {bankAccounts?.length === 0 ? (
            <p className="text-accent-light">
              No bank accounts linked yet. Link your first bank account to start tracking transactions.
            </p>
          ) : (
            <div className="space-y-4">
              {bankAccounts?.map((account) => (
                <div
                  key={account.id}
                  className="p-4 border rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{account.account_name}</p>
                    <p className="text-sm text-accent-light">
                      {account.bank_name} - {account.account_number}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

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
