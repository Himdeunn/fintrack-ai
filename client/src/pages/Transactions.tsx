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
import { useState, useMemo } from "react";
import { Trash2, Edit2, Plus } from "lucide-react";
import { toast } from "sonner";

const transactionSchema = z.object({
  categoryId: z.number(),
  type: z.enum(["income", "expense"]),
  amount: z.string(),
  description: z.string().optional(),
  notes: z.string().optional(),
  date: z.string(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function Transactions() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const { data: transactions, isLoading, refetch } = trpc.transactions.list.useQuery({
    startDate: dateRange.start ? new Date(dateRange.start) : undefined,
    endDate: dateRange.end ? new Date(dateRange.end) : undefined,
    type: filterType === "all" ? undefined : filterType,
  });

  const { data: categories } = trpc.categories.list.useQuery({});
  const createMutation = trpc.transactions.create.useMutation();
  const updateMutation = trpc.transactions.update.useMutation();
  const deleteMutation = trpc.transactions.delete.useMutation();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    try {
      const payload = {
        ...data,
        date: new Date(data.date),
      };
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...payload });
        toast.success("Transaksi berhasil diperbarui");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Transaksi berhasil ditambahkan");
      }
      setIsOpen(false);
      setEditingId(null);
      form.reset();
      refetch();
    } catch (error) {
      toast.error("Gagal menyimpan transaksi");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Transaksi berhasil dihapus");
        refetch();
      } catch (error) {
        toast.error("Gagal menghapus transaksi");
      }
    }
  };

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(t =>
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold gradient-text">Transaksi</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Transaksi
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Transaksi" : "Tambah Transaksi Baru"}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipe</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="income">Pemasukan</SelectItem>
                            <SelectItem value="expense">Pengeluaran</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            {categories?.map(cat => (
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
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deskripsi</FormLabel>
                        <FormControl>
                          <Input placeholder="Deskripsi transaksi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catatan</FormLabel>
                        <FormControl>
                          <Input placeholder="Catatan tambahan" {...field} />
                        </FormControl>
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

        {/* Filters */}
        <Card className="glow-golden">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-input border-border"
              />
              <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="income">Pemasukan</SelectItem>
                  <SelectItem value="expense">Pengeluaran</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="bg-input border-border"
                />
                <Input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="bg-input border-border"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="glow-golden">
          <CardHeader>
            <CardTitle>Daftar Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center text-muted-foreground">Memuat...</div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center text-muted-foreground">Tidak ada transaksi</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Tanggal</th>
                      <th className="text-left py-3 px-4 font-semibold">Deskripsi</th>
                      <th className="text-left py-3 px-4 font-semibold">Kategori</th>
                      <th className="text-right py-3 px-4 font-semibold">Jumlah</th>
                      <th className="text-center py-3 px-4 font-semibold">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map(transaction => {
                      const category = categories?.find(c => c.id === transaction.categoryId);
                      return (
                        <tr key={transaction.id} className="border-b border-border hover:bg-secondary/50">
                          <td className="py-3 px-4">
                            {new Date(transaction.date).toLocaleDateString("id-ID")}
                          </td>
                          <td className="py-3 px-4">{transaction.description}</td>
                          <td className="py-3 px-4">
                            <span
                              className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                              style={{ backgroundColor: category?.color || "#6366f1" }}
                            >
                              {category?.name}
                            </span>
                          </td>
                          <td className={`py-3 px-4 text-right font-semibold ${transaction.type === "income" ? "text-green-400" : "text-red-400"}`}>
                            {transaction.type === "income" ? "+" : "-"} Rp {parseFloat(transaction.amount.toString()).toLocaleString("id-ID")}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                  onClick={() => {
                    setEditingId(transaction.id);
                    const transDate = new Date(transaction.date).toISOString().split("T")[0];
                    form.reset({
                      categoryId: transaction.categoryId,
                      type: transaction.type,
                      amount: transaction.amount.toString(),
                      description: transaction.description || undefined,
                      notes: transaction.notes || undefined,
                      date: transDate,
                    });
                    setIsOpen(true);
                  }}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(transaction.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
