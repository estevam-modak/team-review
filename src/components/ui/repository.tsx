import { useSession } from "next-auth/react";
import { useRepos } from "~/contexts/repos.context";
import { api } from "~/trpc/react";
import { RefreshCw, X } from "lucide-react";
import { PRCard } from "./pull-request";

export function Repository({ id }: { id: string }) {
  const { repoMap, removeRepo } = useRepos();
  const repo = repoMap[id];

  return (
    <div className="w-80 flex-shrink-0 rounded-lg b flex flex-col gap-4">
      <div className="flex flex-row items-start justify-between gap-1 p-1">
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
      <OpenPRs id={id} />
      <Last5MergedPRs id={id} />
    </div>
  );
}

function OpenPRs({ id }: { id: string }) {
  const { data: session } = useSession();
  const { repoMap } = useRepos();
  const token = session
    ? (session as unknown as { accessToken: string })?.accessToken
    : undefined;
  const repo = repoMap[id];

  const {
    data: open,
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
      : open
        ? open.prs?.length +
          " of " +
          open.totalCount +
          " at " +
          new Date(dataUpdatedAt).toLocaleString("en-UK", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Could not fetch";

  return (
    <div className="flex min-h-24 w-full flex-col gap-3 rounded-sm border bg-muted px-3 py-3">
      <div className="flex flex-row items-center justify-center gap-2 text-xs text-muted-foreground/50">
        {text}
        {!isFetching && (
          <button
            className="text-muted-foreground opacity-50 hover:text-ring hover:opacity-100"
            onClick={() => refetch()}
          >
            <RefreshCw className="size-3" />
          </button>
        )}
      </div>
      {open &&
        open.prs.map((pr) => (
          <PRCard
            key={pr.id}
            pr={pr}
          />
        ))}
    </div>
  );
}

function Last5MergedPRs({ id }: { id: string }) {
  const { data: session } = useSession();
  const { repoMap } = useRepos();
  const token = session
    ? (session as unknown as { accessToken: string })?.accessToken
    : undefined;
  const repo = repoMap[id];

  const {
    data: merged,
    isFetching,
    isError,
    dataUpdatedAt,
    refetch,
  } = api.pullRequests.last5MergedPRs.useQuery(
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
      : merged
        ? "Last merged"
        : "Could not fetch";

  return (
    <div className="flex min-h-24 w-full flex-col gap-3 rounded-sm border bg-muted px-3 py-3">
      <div className="flex flex-row items-center justify-center gap-2 text-xs text-muted-foreground/50">
        {text}
        {!isFetching && (
          <button
            className="text-muted-foreground opacity-50 hover:text-ring hover:opacity-100"
            onClick={() => refetch()}
          >
            <RefreshCw className="size-3" />
          </button>
        )}
      </div>
      {merged &&
        merged.prs.map((pr) => (
          <PRCard
            key={pr.id}
            pr={pr}
          />
        ))}
    </div>
  );
}
