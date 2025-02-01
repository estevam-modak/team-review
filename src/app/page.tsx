"use client";
import { Button } from "~/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { AddRepository } from "~/components/ui/add-repository";
import { useRepos } from "~/contexts/repos.context";
import { Repository } from "~/components/ui/repository";
import { useEffect } from "react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Check, Sun } from "lucide-react";
import { Moon } from "lucide-react";
import { ViewControlProvider } from "~/contexts/view-control.context";
import { UserFilter } from "~/components/ui/user-filter";
import { DraftFilter } from "~/components/ui/draft-filter";

export default function Home() {
  const { repos } = useRepos();

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <ViewControlProvider>
        <div className="flex flex-grow flex-col w-full">
          <div className="px-4 py-2 flex  w-full border-b border-b-foreground/10 gap-8 ">
            <AddRepository />
            <UserFilter />
            <DraftFilter /> 
          </div>
          <div className="flex w-full flex-row gap-4 overflow-x-auto px-16 py-8 flex-grow">
            {repos.map((repo) => (
              <Repository key={repo} id={repo} />
            ))}
          </div>
        </div>
      </ViewControlProvider>
    </main>
  );
}

function Header() {
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

function AuthButton() {
  const { data: session } = useSession();

  const login = (session?.user as { login: string })?.login;

  if (!session)
    return (
      <Button size="sm" variant="default" onClick={() => signIn()}>
        Connect
      </Button>
    );

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="relative inline-flex size-2 rounded-full bg-green-500" />
        <span>{login}</span>
      </div>
      <Button size="sm" variant="outline" onClick={() => signOut()}>
        Log out
      </Button>
    </div>
  );
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="icon"
      variant="outline"
      className="rounded-md p-2 hover:bg-accent"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  ); 
}