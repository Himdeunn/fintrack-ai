import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownLeft, TrendingUp, Target } from "lucide-react";
import { useMemo } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: transactions, isLoading: transactionsLoading } = trpc.transactions.list.useQuery({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  });

  const { data: budgets } = trpc.budgets.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery({});

  // Calculate summary metrics
  const summary = useMemo(() => {
    if (!transactions) return { income: 0, expenses: 0, balance: 0, savingsRate: 0 };

    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const balance = income - expenses;
    const savingsRate = income > 0 ? ((balance / income) * 100).toFixed(1) : "0";

    return { income, expenses, balance, savingsRate };
  }, [transactions]);

  // Prepare chart data
  const monthlyData = useMemo(() => {
    if (!transactions) return [];
    
    const data: Record<string, { income: number; expenses: number }> = {};
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!data[key]) {
        data[key] = { income: 0, expenses: 0 };
      }
      
      const amount = parseFloat(t.amount.toString());
      if (t.type === "income") {
        data[key].income += amount;
      } else {
        data[key].expenses += amount;
      }
    });

    return Object.entries(data).map(([month, values]) => ({
      month,
      ...values,
    })).slice(-6);
  }, [transactions]);

  const categorySpending = useMemo(() => {
    if (!transactions || !categories) return [];

    const categoryMap = new Map(categories.map(c => [c.id, { name: c.name, color: c.color }]));
    const spending: Record<number, number> = {};

    transactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        spending[t.categoryId] = (spending[t.categoryId] || 0) + parseFloat(t.amount.toString());
      });

    return Object.entries(spending).map(([catId, amount]) => {
      const cat = categoryMap.get(Number(catId));
      return {
        name: cat?.name || "Lainnya",
        value: amount,
        color: cat?.color || "#6366f1",
      };
    });
  }, [transactions, categories]);

  const balanceTrend = useMemo(() => {
    if (!transactions) return [];

    const data: Record<string, number> = {};
    let runningBalance = 0;

    transactions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .forEach(t => {
        const date = new Date(t.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        
        const amount = parseFloat(t.amount.toString());
        runningBalance += t.type === "income" ? amount : -amount;
        data[key] = runningBalance;
      });

    return Object.entries(data).map(([date, balance]) => ({
      date,
      balance,
    })).slice(-30);
  }, [transactions]);

  if (transactionsLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glow-golden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold gradient-text">
                Rp {summary.income.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Bulan ini</p>
            </CardContent>
          </Card>

          <Card className="glow-golden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
              <ArrowDownLeft className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                Rp {summary.expenses.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Bulan ini</p>
            </CardContent>
          </Card>

          <Card className="glow-golden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Bersih</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                Rp {summary.balance.toLocaleString('id-ID')}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Bulan ini</p>
            </CardContent>
          </Card>

          <Card className="glow-golden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tingkat Tabungan</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {summary.savingsRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Dari pemasukan</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Income vs Expenses */}
          <Card className="glow-golden">
            <CardHeader>
              <CardTitle>Pemasukan vs Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                  <XAxis dataKey="month" stroke="#999999" />
                  <YAxis stroke="#999999" />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d" }} />
                  <Legend />
                  <Bar dataKey="income" fill="#fbbf24" name="Pemasukan" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Pengeluaran" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Spending by Category */}
          <Card className="glow-golden">
            <CardHeader>
              <CardTitle>Pengeluaran per Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              {categorySpending.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categorySpending}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: Rp ${value.toLocaleString('id-ID')}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categorySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-300 flex items-center justify-center text-muted-foreground">
                  Belum ada data pengeluaran
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Balance Trend */}
        <Card className="glow-golden">
          <CardHeader>
            <CardTitle>Tren Saldo</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={balanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />
                <XAxis dataKey="date" stroke="#999999" />
                <YAxis stroke="#999999" />
                <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #2d2d2d" }} />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#d4af37"
                  dot={false}
                  isAnimationActive={true}
                  name="Saldo"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
