import type { Metadata } from "next";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { Toaster } from 'sonner';
import "./globals.css";

export const metadata: Metadata = {
  title: "FinTrack - Smart Finance Tracker",
  description: "Manage your finances with AI insights and modern minimalist design.",
  icons: {
    icon: "/favico.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      <body className="antialiased font-sans">
        <LanguageProvider>
          <QueryProvider>
            {children}
            <Toaster richColors closeButton position="top-right" />
          </QueryProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}