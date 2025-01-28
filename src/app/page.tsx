'use client'
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { InlineBadgeListManager } from "~/components/ui/input-badges";
import { api, RouterOutputs } from "~/trpc/react";

export default function Home() {
  const [repos, setRepos] = useState<string[]>(["domain-fintech", "banking"])
  const [editingRepos, setEditingRepos] = useState<boolean>(false)

  const openPrs = api.pullRequests.getOpenPRs.useQuery({ repos })
  const mergedPrs = api.pullRequests.getLast5MergedPRs.useQuery({ repos })

  useEffect(() => {
    openPrs.refetch()
    mergedPrs.refetch()
  }, [repos])

  const today: PullRequest[] = []
  const lastWeek: PullRequest[] = []
  const others: PullRequest[] = []

  openPrs.data?.forEach(pr => {
    const date = new Date(pr.created_at)
    if (date.toISOString().split("T")[0] === new Date().toISOString().split("T")[0]) {
      today.push(pr)
    }
    else if (date >= new Date(new Date().setDate(new Date().getDate() - 7))) {
      lastWeek.push(pr)
    }
    else {
      others.push(pr)
    }
  })


  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex justify-start p-4">
        <InlineBadgeListManager badges={repos} setBadges={setRepos} />
      </div>

      <div className="flex justify-end p-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            openPrs.refetch()
            mergedPrs.refetch()
          }}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col p-4 gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold">Open</h2>
          <div className="flex flex-col gap-2 w-full p-4 border">
            {openPrs.isFetching && <RefreshCw className="w-4 h-4 animate-spin" />}
            
            <h4 className="font-bold text-muted-foreground text-sm font-normal">today</h4>
            <div className="flex flex-wrap gap-2 w-full">
              {today.map((pr) => <PRCard pr={pr} key={pr.id} />)}
            </div>

            <h4 className="font-bold text-muted-foreground text-sm font-normal">last week</h4>
            <div className="flex flex-wrap gap-2 w-full">
              {lastWeek.map((pr) => <PRCard pr={pr} key={pr.id} />)}
            </div>

            <h4 className="font-bold text-muted-foreground text-sm font-normal">+1w</h4>
            <div className="flex flex-wrap gap-2 w-full">
              {others.map((pr) => <PRCard pr={pr} key={pr.id} />)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-bold">Merged Today (last 5 per repo)</h2>
          <div className="flex flex-col gap-2 w-full p-4 border">
            {mergedPrs.isFetching && <RefreshCw className="w-4 h-4 animate-spin" />}
            <div className="flex flex-wrap gap-2 w-full">
              {mergedPrs.data?.map((pr) => <PRCard pr={pr} key={pr.id} />)}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

type PullRequest = RouterOutputs["pullRequests"]["getOpenPRs"][number]

function PRCard({ pr }: { pr: PullRequest }) {
  const status = pr.merged_at ? "merged" : pr.closed_at ? "closed" : pr.draft ? "draft" : "open"

  const isOpen = status === "open"

  const info = api.pullRequests.getPullRequest.useQuery({
    repo: pr.head.repo.name,
    number: pr.number,
  }, {
    enabled: isOpen,
  })

  const reviews = api.pullRequests.getPullRequestReviews.useQuery({
    repo: pr.head.repo.name,
    number: pr.number,
  }, {
    enabled: isOpen,
  })

  const initialDate = new Date(pr.created_at)
  const finalDate = pr.merged_at ? new Date(pr.merged_at) : pr.closed_at ? new Date(pr.closed_at) : new Date()
  const timeBetween = finalDate.getTime() - initialDate.getTime()
  const days = Math.floor(timeBetween / 1000 / 60 / 60 / 24)
  const hours = Math.floor(timeBetween / 1000 / 60 / 60) % 24
  const minutes = Math.floor(timeBetween / 1000 / 60) % 60
  const waiting = days > 0 ? `${days}d` : hours > 0 ? `${hours}h` : minutes > 0 ? `${minutes}m` : "now"

  const approvals = reviews.data?.filter(r => r.state === "APPROVED").length
  const rejections = reviews.data?.filter(r => r.state === "CHANGES_REQUESTED").length

  return <div key={pr.id} className={`w-60 border flex flex-col items-start text-xs 
    ${status === "draft" ? "bg-muted" : undefined}
  `}>
    <div className="flex flex-row px-1 py-0.5 w-full bg-gray-100 justify-between items-center border-b">
      <a href={pr.head.repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline max-w-40 truncate text-blue-900">{pr.head.repo.name}</a>
      <div className="flex flex-row gap-0.5">
        {(isOpen && (approvals || rejections)) ? <Badge variant='outline' className="text-xs bg-white">+{approvals} -{rejections}</Badge> : undefined}
        <Badge variant='outline' className="text-xs bg-white">{waiting}</Badge>
      </div>
    </div>
    <div className="flex flex-col p-2 w-full gap-2">
      <div className="flex justify-between w-full">
        <div>{pr.user?.login}</div>
        {isOpen && <div>{info.data?.changed_files} ({info.data?.additions}-{info.data?.deletions})</div>}
      </div>
      <div>
        <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-900">{pr.title}</a>
      </div>
    </div>
  </div>
}