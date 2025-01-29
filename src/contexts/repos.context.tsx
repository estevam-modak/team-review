import * as React from "react";
import { useReposReducer } from "~/hooks/repos.reducer";
import { PullRequest } from "~/types";

interface ReposContextType {
  repos: string[];
  addRepo: (repo: string, color: string) => void;
  removeRepo: (repo: string) => void;
  openPRs: PullRequest[];
  closedPRs: PullRequest[];
  updateColor: (repo: string, color: string) => void;
  colors: { [key: string]: string };
  updateRepoPRs: (repo: string, open: PullRequest[], closed: PullRequest[]) => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
}

const ReposContext = React.createContext<ReposContextType | undefined>(undefined);

export function ReposProvider({ children }: { children: React.ReactNode }) {
  const reposState = useReposReducer();

  return (
    <ReposContext.Provider value={reposState}>
      {children}
    </ReposContext.Provider>
  );
}

export function useRepos() {
  const context = React.useContext(ReposContext);
  if (context === undefined) {
    throw new Error("useRepos must be used within a ReposProvider");
  }
  return context;
} 