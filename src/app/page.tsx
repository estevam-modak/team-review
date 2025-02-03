"use client";
import { AddRepository } from "~/components/ui/add-repository";
import { useRepos } from "~/contexts/repos.context";
import { Repository } from "~/components/ui/repository";
import { ViewControlProvider } from "~/contexts/view-control.context";
import { UserFilter } from "~/components/ui/filter.user";
import { DraftFilter } from "~/components/ui/filter.draft";
import { Header } from "./header";

export default function Home() {
  const { repos } = useRepos();

  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <ViewControlProvider>
        <div className="flex flex-grow flex-col w-full">
          <div className="px-4 py-2 flex  w-full border-b border-b-foreground/10 gap-8 ">
            <AddRepository />
            <DraftFilter /> 
            <UserFilter />
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
