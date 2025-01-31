import * as React from "react";
import { useLocalStorage } from "~/hooks/use-local-storage";

interface ReposContextType {
  repos: string[];
  repoMap: { [key: string]: { id: string, name: string, org: string, color: string } };
  addRepo: (id: string, name: string, org: string, color: string) => void;
  removeRepo: (id: string) => void;
  updateRepoName: (id: string, name: string) => void;
  updateRepoOrg: (id: string, org: string) => void;
  updateRepoColor: (id: string, color: string) => void;
}

const ReposContext = React.createContext<ReposContextType | undefined>(undefined);

export function ReposProvider({ children }: { children: React.ReactNode }) {
  const [repos, setRepos] = useLocalStorage<string[]>("repos", []);
  const [repoMap, setRepoMap] = useLocalStorage<{ [key: string]: {
    id: string;
    name: string;
    org: string;
    color: string;
  } }>("repoMap", {});

  const addRepo = (id: string, name: string, org: string, color: string) => {
    if (repoMap[id]) throw new Error("Repo already exists");
    const newMap = { ...repoMap, [id]: { id, name, org, color } };
    setRepoMap(newMap);
    setRepos([...repos, id]);
  }

  const removeRepo = (id: string) => {
    console.log("removeRepo", id)
    console.log("repos", repos)
    if (!repoMap[id]) throw new Error("Repo not found");
    const newRepos = repos.filter(repo => repo !== id);
    console.log("newRepos", newRepos)
    setRepos([...newRepos]);
    const newMap = Object.fromEntries(Object.entries(repoMap).filter(([key]) => key !== id));
    setRepoMap(newMap);
  }

  const updateRepoName = (id: string, name: string) => {
    if (!repoMap[id]) throw new Error("Repo not found");
    const newMap = { ...repoMap, [id]: { ...repoMap[id], name } };
    setRepoMap(newMap);
  }

  const updateRepoOrg = (id: string, org: string) => {
    if (!repoMap[id]) throw new Error("Repo not found");
    const newMap = { ...repoMap, [id]: { ...repoMap[id], org } };
    setRepoMap(newMap);
  }

  const updateRepoColor = (id: string, color: string) => {
    if (!repoMap[id]) throw new Error("Repo not found");
    const newMap = { ...repoMap, [id]: { ...repoMap[id], color } };
    setRepoMap(newMap);
  }

  return (
    <ReposContext.Provider value={{ repos, repoMap, addRepo, removeRepo, updateRepoName, updateRepoOrg, updateRepoColor }}>
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