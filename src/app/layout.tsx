import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { Toaster } from 'sonner';
import "./globals.css";

export const metadata: Metadata = {
  title: "Avaraé - Smart Finance Architecture",
  description: "Manage your finances with Gemini AI insights and modern minimalist design.",
  icons: {
    icon: "/LogoBG.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Avaraé",
  },
  formatDetection: {
    telephone: false,
  },
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <link rel="shortcut icon" href="/LogoBG.png" type="image/png" />
      <link rel="apple-touch-icon" href="/LogoBG.png" />
      <meta name="theme-color" content="#26538D" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <body className="antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <QueryProvider>
              {children}
              <Toaster richColors closeButton position="top-right" expand={false} mobileOffset={20} />
            </QueryProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
