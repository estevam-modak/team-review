"use client";

import { AuthButton } from "~/components/ui/button.auth";
import { ThemeToggle } from "~/components/ui/button.theme";
import Image from "next/image";
export function Header() {
  return (
    <div className="flex items-center justify-start border-b px-4 py-2">
      <div className="flex flex-grow items-center justify-start">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer">
          <Image src="/icon.png" alt="Team Review" width={20} height={20} />
          TEAM REVIEW
        </div>
      </div>
      <div className="flex items-center justify-end">
        <AuthButton />
        <ThemeToggle />
      </div>
    </div>
  );
}