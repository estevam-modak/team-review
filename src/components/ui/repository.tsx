import { useSession } from "next-auth/react";
import { useRepos } from "~/contexts/repos.context";
import { api } from "~/trpc/react";
import { Loader2, RefreshCw, X } from "lucide-react";
import { PRCard } from "./pull-request";
import { PullRequest } from "~/server/api/routers/pull-requests";

export function Repository({ id }: { id: string }) {
  const { repoMap, removeRepo } = useRepos();
  const { data: session } = useSession();
  const repo = repoMap[id];
  const token = session
    ? (session as unknown as { accessToken: string })?.accessToken
    : undefined;

  const enabled = repo && !!token && repo.name != "" && repo.org != "";

  const params = {
    repo: repo?.name || "",
    org: repo?.org || "",
    token: token || "",
  };

  const open = api.pullRequests.getOpen.useQuery(params, {
    retry: false,
    enabled,
  });

  const merged = api.pullRequests.getMerged.useQuery(params, {
    retry: false,
    enabled,
  });

  const refresh = () => {
    open.refetch();
    merged.refetch();
  };

  const loading = open.isFetching || merged.isFetching;

  return (
    <div className="w-80 flex-shrink-0 rounded-lg b flex flex-col gap-4">
      <div className="flex flex-row items-start justify-between gap-1 p-1">
        <div className="flex flex-row items-center gap-1">
          <button
            className="text-muted-foreground opacity-50 hover:text-foreground hover:opacity-100"
            onClick={() => removeRepo(id)}
          >
            <X className="size-4 hover:text-destructive" />
          </button>
          <a
            href={`https://github.com/${repo?.org}/${repo?.name}`}
            target="_blank"
            className="text-sm text-foreground hover:underline"
          >
            {repo?.org}/{repo?.name}
          </a>
        </div>
        <button
            className="text-muted-foreground opacity-50 hover:text-foreground hover:opacity-100"
            onClick={refresh}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4 hover:text-foreground" />
            )}
          </button>
      </div>
      <Open
        ready={open.data?.prs.ready || []}
        draft={open.data?.prs.draft || []}
        totalCount={open.data?.totalCount || 0}
      />
      <Merged prs={merged.data?.prs || []} />
    </div>
  );
}

function Open({ ready, draft, totalCount }: { ready: PullRequest[], draft: PullRequest[], totalCount: number }) {

  const text = (ready.length + draft.length) + " of " + totalCount 
  return (
    <div className="flex w-full flex-col gap-3 rounded-sm border bg-muted px-3 py-3">
      <div className="flex flex-row items-center justify-center gap-2 text-xs text-muted-foreground/50">
        {text}
      </div>
      {ready.map((pr) => (
        <PRCard
          key={pr.id}
          pr={pr}
        />
      ))}

      {draft.length > 0 && (
        <div className="flex flex-row items-center justify-center gap-2 text-xs text-muted-foreground/50">
          <div className="h-[1px] flex-1 border-t border-muted-foreground/20 border-dashed"></div>
          {draft.length} drafts
          <div className="h-[1px] flex-1 border-t border-muted-foreground/20 border-dashed"></div>
        </div>
      )}

      {draft.map((pr) => (
        <PRCard
          key={pr.id}
          pr={pr}
        />
      ))}
    </div>
  );
}

function Merged({ prs }: { prs: PullRequest[] }) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-sm border bg-muted px-3 py-3">
      <div className="flex flex-row items-center justify-center gap-2 text-xs text-muted-foreground/50">
        Last {prs.length} merged
      </div>
      {prs.map((pr) => (
        <PRCard
          key={pr.id}
          pr={pr}
          />
        ))}
    </div>
  );
}
