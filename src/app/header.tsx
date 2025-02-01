"use client";

import { AuthButton } from "~/components/ui/button.auth";
import { ThemeToggle } from "~/components/ui/button.theme";

export function Header() {
  return (
    <div className="flex items-center justify-start border-b px-4 py-2">
      <div className="flex flex-grow items-center justify-start">
        <h1 className="text-xs font-semibold text-muted-foreground">
          TEAM REVIEW
        </h1>
      </div>
      <div className="flex items-center justify-end">
        <AuthButton />
        <ThemeToggle />
      </div>
    </div>
  );
}