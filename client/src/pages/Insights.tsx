import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, TrendingUp, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Streamdown } from "streamdown";

export default function Insights() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"summary" | "health" | "tips">("summary");

  const { data: summaryData, isLoading: summaryLoading } = trpc.insights.weeklySummary.useQuery();
  const { data: healthData, isLoading: healthLoading } = trpc.insights.healthScore.useQuery();
  const { data: tipsData, isLoading: tipsLoading } = trpc.insights.savingsTips.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">AI Financial Insights</h1>
          <p className="text-muted-foreground">Analisis keuangan personal Anda dengan kekuatan AI</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          <Button
            variant={activeTab === "summary" ? "default" : "ghost"}
            onClick={() => setActiveTab("summary")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <Zap className="mr-2 h-4 w-4" />
            Ringkasan Minggu
          </Button>
          <Button
            variant={activeTab === "health" ? "default" : "ghost"}
            onClick={() => setActiveTab("health")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Skor Kesehatan
          </Button>
          <Button
            variant={activeTab === "tips" ? "default" : "ghost"}
            onClick={() => setActiveTab("tips")}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <Lightbulb className="mr-2 h-4 w-4" />
            Tips Penghematan
          </Button>
        </div>

        {/* Weekly Summary */}
        {activeTab === "summary" && (
          <Card className="glow-golden">
            <CardHeader>
              <CardTitle>Ringkasan Pengeluaran Minggu Ini</CardTitle>
            </CardHeader>
            <CardContent>
              {summaryLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-secondary/30 border border-border rounded-lg p-4">
                    {typeof summaryData?.summary === "string" && (
                      <Streamdown>
                        {summaryData.summary}
                      </Streamdown>
                    )}
                  </div>
                  {summaryData?.transactions && summaryData.transactions.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Transaksi Terkini:</h3>
                      <div className="space-y-2">
                        {summaryData.transactions.slice(0, 5).map((t, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                            <span className="text-sm">{t.description}</span>
                            <span className={`font-semibold ${t.type === "income" ? "text-green-400" : "text-red-400"}`}>
                              {t.type === "income" ? "+" : "-"} Rp {parseFloat(t.amount.toString()).toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Health Score */}
        {activeTab === "health" && (
          <div className="space-y-4">
            {healthLoading ? (
              <Card className="glow-golden">
                <CardContent className="pt-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="glow-golden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Total Pemasukan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-400">
                        Rp {healthData?.income.toLocaleString("id-ID")}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glow-golden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Total Pengeluaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-400">
                        Rp {healthData?.expenses.toLocaleString("id-ID")}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glow-golden">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Tingkat Tabungan</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        {healthData?.savingsRate.toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="glow-golden">
                  <CardHeader>
                    <CardTitle>Analisis Kesehatan Keuangan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-secondary/30 border border-border rounded-lg p-4">
                      {typeof healthData?.analysis === "string" && (
                        <Streamdown>
                          {healthData.analysis}
                        </Streamdown>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Saving Tips */}
        {activeTab === "tips" && (
          <Card className="glow-golden">
            <CardHeader>
              <CardTitle>Tips Penghematan Personal</CardTitle>
            </CardHeader>
            <CardContent>
              {tipsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <div className="space-y-6">
                  {tipsData?.categorySpending && tipsData.categorySpending.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Pengeluaran per Kategori:</h3>
                      <div className="space-y-2">
                        {tipsData.categorySpending.map((cs, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                            <span className="text-sm">{cs.category}</span>
                            <span className="font-semibold text-primary">
                              Rp {cs.total.toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold mb-3">Rekomendasi Penghematan:</h3>
                    <div className="bg-secondary/30 border border-border rounded-lg p-4">
                      {typeof tipsData?.tips === "string" && (
                        <Streamdown>
                          {tipsData.tips}
                        </Streamdown>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
