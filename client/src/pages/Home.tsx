import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ArrowRight, Zap, TrendingUp, Brain, Shield } from "lucide-react";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated, loading]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 md:py-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold gradient-text">FinTrack AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            asChild
            className="text-foreground hover:text-primary"
          >
            <a href="#features">Fitur</a>
          </Button>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = getLoginUrl(); }}>Masuk</a>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-12 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold gradient-text leading-tight">
              Kelola Keuangan Anda dengan Kekuatan AI
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              FinTrack AI menghadirkan pengalaman manajemen keuangan yang cinematic dan premium. Dapatkan insights mendalam tentang pengeluaran Anda dengan analisis AI real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
            >
              <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = getLoginUrl(); }}>
                Mulai Sekarang
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border hover:bg-secondary px-8"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Fitur Unggulan
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola keuangan dengan percaya diri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all glow-golden">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Dashboard Interaktif</h3>
              <p className="text-muted-foreground text-sm">
                Visualisasi data keuangan Anda dengan grafik yang indah dan informatif
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all glow-golden">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">AI Insights</h3>
              <p className="text-muted-foreground text-sm">
                Dapatkan analisis mendalam dan rekomendasi personal dari AI
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all glow-golden">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Budget Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Atur budget dan dapatkan alert proaktif saat mendekati batas
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all glow-golden">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Real-time Sync</h3>
              <p className="text-muted-foreground text-sm">
                Data Anda tersinkronisasi secara real-time di semua perangkat
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 md:px-12 py-20">
        <div className="max-w-4xl mx-auto text-center bg-card border border-border rounded-lg p-12 glow-golden">
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">
            Siap Mengubah Cara Anda Mengelola Keuangan?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat FinTrack AI
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
          >
            <a href="#" onClick={(e) => { e.preventDefault(); window.location.href = getLoginUrl(); }}>
              Mulai Gratis Sekarang
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 md:px-12 py-8 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold">FinTrack AI</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2026 FinTrack AI. Semua hak dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
