"use client";
import { Button } from "~/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import { AddRepository } from "~/components/ui/add-repository";
import { useRepos } from "~/contexts/repos.context";
import { Repository } from "~/components/ui/repository";

export default function Home() {
  const { repos } = useRepos();

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-grow flex-col bg-muted">
        <div className="mx-16 my-4 flex w-60">
          <AddRepository />
        </div>
        <div className="flex w-full flex-row gap-4 overflow-x-auto px-16 py-4">
          {repos.map((repo) => (
            <Repository key={repo} id={repo} />
          ))}
        </div>
      </div>
    </main>
  );
}

function Header() {
  return (
    <div className="flex items-center justify-start border-b px-4 py-2">
      <div className="flex flex-grow items-center justify-start"></div>
      <div className="flex items-center justify-end">
        <AuthButton />
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
