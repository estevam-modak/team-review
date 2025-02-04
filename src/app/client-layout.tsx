"use client";
import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "~/components/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";
import { ReposProvider } from "~/contexts/repos.context";
import { SessionProvider } from "next-auth/react";

export function ClientLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  console.log("ClientLayout");
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable}`}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <TRPCReactProvider>
              <ReposProvider>{children}</ReposProvider>
            </TRPCReactProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 