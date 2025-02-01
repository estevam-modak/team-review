"use client";
import { Button } from "./button";
import { signIn, signOut, useSession } from "next-auth/react";


export function AuthButton() {
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
