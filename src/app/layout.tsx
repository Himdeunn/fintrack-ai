'use client'

import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Syncopate } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { useEffect } from "react";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["100", "400", "900"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["100", "400", "800"],
});

const syncopate = Syncopate({
  subsets: ["latin"],
  variable: "--font-syncopate",
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    
    const moveCursor = (e: MouseEvent) => {
      if (cursor && follower) {
        cursor.style.transform = `translate3d(${e.clientX - 10}px, ${e.clientY - 10}px, 0)`;
        follower.style.transform = `translate3d(${e.clientX - 30}px, ${e.clientY - 30}px, 0)`;
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <html lang="en" className="dark">
      <body className={`${outfit.variable} ${mono.variable} ${syncopate.variable} antialiased`}>
        <div id="custom-cursor" className="hidden lg:block" />
        <div id="custom-cursor-follower" className="hidden lg:block" />
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}