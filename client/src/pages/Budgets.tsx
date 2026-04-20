import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Trash2, Edit2, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const budgetSchema = z.object({
  categoryId: z.number(),
  limit: z.string(),
  alertThreshold: z.string().optional(),
  period: z.enum(["monthly", "yearly"]).optional(),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export default function Budgets() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: budgets, isLoading, refetch } = trpc.budgets.list.useQuery();
  const { data: categories } = trpc.categories.list.useQuery({});
  const { data: transactions } = trpc.transactions.list.useQuery({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  });

  const createMutation = trpc.budgets.create.useMutation();
  const updateMutation = trpc.budgets.update.useMutation();
  const deleteMutation = trpc.budgets.delete.useMutation();

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      period: "monthly",
      alertThreshold: "80",
    },
  });

  const onSubmit = async (data: BudgetFormData) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...data });
        toast.success("Budget berhasil diperbarui");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Budget berhasil ditambahkan");
      }
      setIsOpen(false);
      setEditingId(null);
      form.reset();
      refetch();
    } catch (error) {
      toast.error("Gagal menyimpan budget");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus budget ini?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Budget berhasil dihapus");
        refetch();
      } catch (error) {
        toast.error("Gagal menghapus budget");
      }
    }
  };

  const calculateSpending = (categoryId: number) => {
    if (!transactions) return 0;
    return transactions
      .filter(t => t.categoryId === categoryId && t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  };

  const getProgressPercentage = (budget: any) => {
    const spending = calculateSpending(budget.categoryId);
    const limit = parseFloat(budget.limit.toString());
    return Math.min((spending / limit) * 100, 100);
  };

  const isAlertTriggered = (budget: any) => {
    const percentage = getProgressPercentage(budget);
    const threshold = parseFloat(budget.alertThreshold?.toString() || "80");
    return percentage >= threshold;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold gradient-text">Budget & Target</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Budget" : "Tambah Budget Baru"}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.filter(c => c.type === "expense").map(cat => (
                              <SelectItem key={cat.id} value={cat.id.toString()}>
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batas Budget</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="alertThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Threshold Alert (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="80" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="period"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Periode</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="monthly">Bulanan</SelectItem>
                            <SelectItem value="yearly">Tahunan</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    {editingId ? "Perbarui" : "Tambah"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Budgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full text-center text-muted-foreground">Memuat...</div>
          ) : budgets && budgets.length > 0 ? (
            budgets.map(budget => {
              const category = categories?.find(c => c.id === budget.categoryId);
              const spending = calculateSpending(budget.categoryId);
              const limit = parseFloat(budget.limit.toString());
              const percentage = getProgressPercentage(budget);
              const isAlert = isAlertTriggered(budget);

              return (
                <Card key={budget.id} className={`glow-golden ${isAlert ? "border-red-500/50" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{category?.name}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {budget.period === "monthly" ? "Bulanan" : "Tahunan"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingId(budget.id);
                            form.reset(budget);
                            setIsOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(budget.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isAlert && (
                      <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-xs text-red-400">Mendekati batas budget</span>
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Pengeluaran</span>
                        <span className="text-sm font-semibold">
                          Rp {spending.toLocaleString("id-ID")} / Rp {limit.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {percentage.toFixed(1)}% dari budget
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Sisa: <span className={percentage >= 100 ? "text-red-400" : "text-green-400"}>
                          Rp {Math.max(0, limit - spending).toLocaleString("id-ID")}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center text-muted-foreground py-8">
              Belum ada budget. Mulai dengan menambahkan budget baru.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
