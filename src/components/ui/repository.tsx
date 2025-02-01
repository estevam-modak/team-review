import { useSession } from "next-auth/react";
import { useRepos } from "~/contexts/repos.context";
import { api } from "~/trpc/react";
import { RefreshCw, X } from "lucide-react";
import { PRCard } from "./pull-request";

export function Repository({ id }: { id: string }) {
  const { repoMap, removeRepo } = useRepos();
  const repo = repoMap[id];

  return (
    <div className="w-80 flex-shrink-0 rounded-lg">
      <div className="flex flex-row items-start justify-between gap-1 p-1 pb-2">
        <a
          href={`https://github.com/${repo?.org}/${repo?.name}`}
          target="_blank"
          className="text-sm text-foreground hover:underline"
        >
          {repo?.org}/{repo?.name}
        </a>
        <button
          className="text-muted-foreground opacity-50 hover:text-foreground hover:opacity-100"
          onClick={() => removeRepo(id)}
        >
          <X className="size-4 hover:text-destructive" />
        </button>
      </div>
      <PRs id={id} />
    </div>
  );
}

function PRs({ id }: { id: string }) {
  const { data: session } = useSession();
  const { repoMap } = useRepos();
  const token = session
    ? (session as unknown as { accessToken: string })?.accessToken
    : undefined;
  const repo = repoMap[id];

  const {
    data: prs,
    isFetching,
    isError,
    dataUpdatedAt,
    refetch,
  } = api.pullRequests.getOpenPRs.useQuery(
    {
      repo: repo?.name || "",
      org: repo?.org || "",
      token: token || "",
    },
    {
      retry: false,
      enabled: repo && !!token && repo.name != "" && repo.org != "",
    },
  );

  const text = isFetching
    ? "Loading..."
    : isError
      ? "Error fetching"
      : (prs?.length ?? 0) +
        " at " +
        new Date(dataUpdatedAt).toLocaleString("en-UK", {
          hour: "2-digit",
          minute: "2-digit",
        });

  return (
    <div className="flex min-h-24 w-full flex-col gap-3 rounded-sm border bg-background px-3 py-3">
      <div className="flex flex-row items-center justify-center gap-2 text-xs text-muted-foreground/50">
        {text}
        {!isFetching && (
          <button
            className="text-muted-foreground opacity-50 hover:text-blue-500 hover:opacity-100"
            onClick={() => refetch()}
          >
            <RefreshCw className="size-3" />
          </button>
        )}
      </div>
      {prs &&
        prs.map((pr) => (
          <PRCard
            key={pr.id}
            pr={pr}
            repo={repo?.name || ""}
            org={repo?.org || ""}
          />
        ))}
    </div>
  );
}
