import * as React from "react";
import { RouterOutputs } from "~/trpc/react";

type PullRequest = RouterOutputs["pullRequests"]["getOpenPRs"][number];

export const useReposReducer = () => {
  const [isFetching, setIsFetching] = React.useState(false);
  const [repos, setRepos] = React.useState<string[]>([]);
  const [reposMap, setReposMap] = React.useState<{
    [key: string]: {
      color: string;
      open: PullRequest[];
      closed: PullRequest[];
    };
  }>({});

  React.useEffect(() => {
    const storedReposMap = localStorage.getItem("reposMap")
    if (storedReposMap) {
        const stored = JSON.parse(storedReposMap)
        setReposMap(stored);
        const keys = Object.keys(stored)
        setRepos(keys)
    }
  }, [])

  React.useEffect(() => {
    const copy = JSON.parse(JSON.stringify(reposMap))
    const keys = Object.keys(copy)
    keys.forEach((key) => {
        copy[key].open = []
        copy[key].closed = []
    })
    localStorage.setItem("reposMap", JSON.stringify(copy))
  }, [reposMap])

  const addRepo = (repo: string, color: string) => {
    setRepos((prev) => [...prev, repo]);
    setReposMap((prev) => ({ ...prev, [repo]: { color, open: [], closed: [] } }));
  };

  const updateColor = (repo: string, color: string) => {
    setReposMap((prev) => {
        const prevRepo = prev[repo]
        if (!prevRepo) return prev
        return ({ ...prev, [repo]: { ...prevRepo, color } })
    });
  };

  const removeRepo = (repo: string) => {
    setRepos((prev) => prev.filter((r) => r !== repo));
    setReposMap((prev) => {
      const { [repo]: _, ...rest } = prev;
      return rest;
    });
  };

  const updateRepoPRs = (repo: string, open: PullRequest[], closed: PullRequest[]) => {
    setReposMap((prev) => {
      const prevRepo = prev[repo];
      if (!prevRepo) return prev;
      return { ...prev, [repo]: { color: prevRepo.color, open, closed } };
    });
  };

  const fetchAllPRs = async () => {
    // setIsFetching(true);
    // try {
    //   const results = await Promise.all(
    //     repos.map(async (repo) => {
    //       // Use o cliente diretamente com uma chamada assíncrona
    //       const data = await caller.pullRequests.getPRsByRepo({ repo });
    //       return { repo, open: data.open, closed: data.closed };
    //     })
    //   );
    //   results.forEach(({ repo, open, closed }) => {
    //     updateRepoPRs(repo, open, closed);
    //   });
    // } catch (error) {
    //   console.error("Error fetching all PRs:", error);
    // } finally {
    //   setIsFetching(false);
    // }
  };
  
  const fetchPR = async (repo: string) => {
    // setIsFetching(true);
    // try {
    //   const data = await caller.pullRequests.getPRsByRepo({ repo });
    //   updateRepoPRs(repo, data.open, data.closed);
    // } catch (error) {
    //   console.error(`Error fetching PRs for repo ${repo}:`, error);
    // } finally {
    //   setIsFetching(false);
    // }
  };
  
  const openPRs = repos
    .flatMap((repo) => reposMap[repo]?.open || [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const closedPRs = repos
    .flatMap((repo) => reposMap[repo]?.closed || [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const colors = Object.fromEntries(Object.entries(reposMap).map(([repo, { color }]) => [repo, color]));

  return { repos, reposMap, addRepo, removeRepo, openPRs, closedPRs, fetchAllPRs, fetchPR, isFetching, updateColor, colors };
};
