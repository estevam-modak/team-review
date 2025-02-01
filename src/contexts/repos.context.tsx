import * as React from "react";
import { useLocalStorage } from "~/hooks/use-local-storage";

interface ReposContextType {
  repos: string[];
  repoMap: { [key: string]: { id: string; name: string; org: string } };
  addRepo: (id: string, name: string, org: string) => void;
  removeRepo: (id: string) => void;
  updateRepoName: (id: string, name: string) => void;
  updateRepoOrg: (id: string, org: string) => void;
}

const ReposContext = React.createContext<ReposContextType | undefined>(
  undefined,
);

export function ReposProvider({ children }: { children: React.ReactNode }) {
  const [repos, setRepos] = useLocalStorage<string[]>("repos", []);
  const [repoMap, setRepoMap] = useLocalStorage<{
    [key: string]: {
      id: string;
      name: string;
      org: string;
    };
  }>("repoMap", {});

  const addRepo = (id: string, name: string, org: string) => {
    if (repoMap[id]) throw new Error("Repo already exists");
    const newMap = { ...repoMap, [id]: { id, name, org } };
    setRepoMap(newMap);
    setRepos([...repos, id]);
  };

  const removeRepo = (id: string) => {
    if (!repoMap[id]) throw new Error("Repo not found");
    const newRepos = repos.filter((repo) => repo !== id);
    setRepos([...newRepos]);
    const newMap = Object.fromEntries(
      Object.entries(repoMap).filter(([key]) => key !== id),
    );
    setRepoMap(newMap);
  };

  const updateRepoName = (id: string, name: string) => {
    if (!repoMap[id]) throw new Error("Repo not found");
    const newMap = { ...repoMap, [id]: { ...repoMap[id], name } };
    setRepoMap(newMap);
  };

  const updateRepoOrg = (id: string, org: string) => {
    if (!repoMap[id]) throw new Error("Repo not found");
    const newMap = { ...repoMap, [id]: { ...repoMap[id], org } };
    setRepoMap(newMap);
  };

  return (
    <ReposContext.Provider
      value={{
        repos,
        repoMap,
        addRepo,
        removeRepo,
        updateRepoName,
        updateRepoOrg,
      }}
    >
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
