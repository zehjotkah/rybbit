"use client";

import { TopBar } from "@/components/TopBar";
import QueryProvider from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";
import { userStore } from "../lib/userStore";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Frogstats Analytics",
  description: "Analytics dashboard for your web applications",
};
const publicRoutes = ["/login"];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isPending } = userStore();

  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !user && !publicRoutes.includes(pathname)) {
      redirect("/login");
    }
  }, [isPending, user, pathname]);

  return (
    <html lang="en" className="h-full dark" suppressHydrationWarning>
      <body
        className={`${inter.className} h-full bg-background text-foreground`}
      >
        <script
          type="module"
          defer
          src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/zoomies.js"
        ></script>
        <ThemeProvider>
          <Theme appearance="dark">
            <QueryProvider>
              {pathname === "/login" ? (
                <div className="min-h-full flex items-center justify-center">
                  {children}
                </div>
              ) : (
                <div className="min-h-full">
                  <TopBar />
                  <main className="flex min-h-screen flex-col items-center p-4">
                    <div className="w-full max-w-6xl">{children}</div>
                  </main>
                </div>
              )}
            </QueryProvider>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
