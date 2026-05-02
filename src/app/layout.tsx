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
      <body className="antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <QueryProvider>
              {children}
              <Toaster richColors closeButton position="top-right" />
            </QueryProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
