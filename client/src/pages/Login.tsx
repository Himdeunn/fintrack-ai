import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const { isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      {/* Background gradient effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">FinTrack AI</h1>
          <p className="text-muted-foreground text-lg">Kelola keuangan Anda dengan kekuatan AI</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 glow-golden">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">Masuk ke Akun Anda</h2>
              <p className="text-muted-foreground">Gunakan Manus OAuth untuk login</p>
            </div>

            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              onClick={() => { window.location.href = getLoginUrl(); }}
            >
              Masuk dengan Manus
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">Atau</span>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>Belum memiliki akun?</p>
              <p className="mt-1">Daftar secara otomatis saat Anda login pertama kali</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Dengan login, Anda menyetujui Syarat & Ketentuan kami</p>
        </div>
      </div>
    </div>
  );
}
