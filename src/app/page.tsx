'use client'
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { InlineBadgeListManager } from "~/components/ui/input-badges";
import { SimpleInput } from "~/components/ui/simple-input";
import { api, RouterOutputs } from "~/trpc/react";

export default function Home() {
  const [repos, setRepos] = useState<string[]>([])
  const [currentUser, setCurrentUser] = useState<string>("")
  const [repoColors, setRepoColors] = useState<{
    [key: string]: string
  }>({})

  const openPrs = api.pullRequests.getOpenPRs.useQuery({ repos })
  const mergedPrs = api.pullRequests.getLast5MergedPRs.useQuery({ repos })

  useEffect(() => {
    const storedRepos = localStorage.getItem("repos")
    const storedRepoColors = localStorage.getItem("repoColors")
    const storedCurrentUser = localStorage.getItem("currentUser")

    if (storedRepos) setRepos(JSON.parse(storedRepos))
    if (storedRepoColors) setRepoColors(JSON.parse(storedRepoColors))
    if (storedCurrentUser) setCurrentUser(storedCurrentUser)
  }, [])

  useEffect(() => {
    openPrs.refetch()
    mergedPrs.refetch()
  }, [repos])

  useEffect(() => {
    localStorage.setItem("repos", JSON.stringify(repos))
  }, [repos])

  useEffect(() => {
    localStorage.setItem("repoColors", JSON.stringify(repoColors))
  }, [repoColors])

  useEffect(() => {
    localStorage.setItem("currentUser", currentUser)
  }, [currentUser])


  const drafts = openPrs.data?.filter(pr => pr.draft) || []
  const ready = openPrs.data?.filter(pr => !pr.draft) || []

  const today: PullRequest[] = []
  const lastWeek: PullRequest[] = []
  const others: PullRequest[] = []

  ready.forEach(pr => {
    const date = new Date(pr.created_at)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 1000 * 60 * 60 * 24) {
      today.push(pr)
    }
    else if (diff < 1000 * 60 * 60 * 24 * 7) {
      lastWeek.push(pr)
    }
    else {
      others.push(pr)
    }
  })

  const setColor = (badge: string, color: string) => {
    setRepoColors({ ...repoColors, [badge]: color })
  }


  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex justify-start px-4 py-2 items-center gap-10">
        <Button variant="outline" size="icon"
          onClick={() => {
            openPrs.refetch()
            mergedPrs.refetch()
          }}
        >
          <RefreshCw className={`w-4 h-4 ${openPrs.isFetching || mergedPrs.isFetching ? "animate-spin" : undefined}`} />
        </Button>
        <SimpleInput value={currentUser} setValue={setCurrentUser} label="Username" />
        <InlineBadgeListManager badges={repos} setBadges={setRepos} colors={repoColors} setColor={setColor} />
      </div>

      <div className="flex flex-col p-4 gap-16 py-16">

        <div className="flex flex-col gap-2">
          <h2 className="font-bold">Open</h2>
          <div className="flex flex-col gap-2 w-full p-4 border bg-muted">            
            <div className="flex flex-wrap gap-2 w-full">
              {today.map((pr) => <PRCard pr={pr} key={pr.id} color={repoColors[pr.head.repo.name]} currentUser={currentUser} setCurrentUser={setCurrentUser} />)}
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {lastWeek.map((pr) => <PRCard pr={pr} key={pr.id} color={repoColors[pr.head.repo.name]} currentUser={currentUser} setCurrentUser={setCurrentUser} />)}
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {others.map((pr) => <PRCard pr={pr} key={pr.id} color={repoColors[pr.head.repo.name]} currentUser={currentUser} setCurrentUser={setCurrentUser} />)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-sm">✅ Merged Today (last 5 PRs per repo)</h2>
          <div className="flex flex-col gap-2 w-full p-4 border bg-muted">
            <div className="flex flex-wrap gap-2 w-full">
              {mergedPrs.data?.map((pr) => <PRCard pr={pr} key={pr.id} color={repoColors[pr.head.repo.name]} currentUser={currentUser} setCurrentUser={setCurrentUser} />)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-sm">🚧 Drafts</h2>
          <div className="flex flex-col gap-2 w-full p-4 border bg-muted">
            <div className="flex flex-wrap gap-2 w-full">
              {drafts.map((pr) => <PRCard pr={pr} key={pr.id} color={repoColors[pr.head.repo.name]} currentUser={currentUser} setCurrentUser={setCurrentUser} />)}
            </div>
          </div>
        </div>


      </div>
    </main>
  );
}

type PullRequest = RouterOutputs["pullRequests"]["getOpenPRs"][number]

function PRCard({ pr, color, currentUser, setCurrentUser }: { pr: PullRequest, color: string | undefined, currentUser: string, setCurrentUser: (user: string) => void }) {
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

  const approvals = reviews.data?.filter(r => r.state === 'APPROVED').length || 0
  const rejections = reviews.data?.filter(r => r.state === "CHANGES_REQUESTED").length || 0
  const iHaveReviewed = reviews.data?.some(r => {
    return r.user?.login === currentUser
  })

  const imRequested = pr.requested_reviewers?.some(r => r.login === currentUser)
  const itsMine = pr.user?.login === currentUser
  const highlight = isOpen && (itsMine || iHaveReviewed || imRequested)
  
  const iApproved = reviews.data?.find(r => r.state === 'APPROVED' && r.user?.login === currentUser)
  const iRejected = reviews.data?.find(r => r.state === "CHANGES_REQUESTED" && r.user?.login === currentUser)

  // MBB-999-title
  const branch = pr.head.ref
  const team = branch.split("-")[0] ?? ""
  const task = branch.split("-")[1] ?? ""
  const taskId = `${team}-${task}`
  const taskUrl = `https://modaklive.atlassian.net/browse/${taskId}`

  return <div key={pr.id} className={`w-60 border flex flex-col items-start text-xs ${highlight ? "border-black" : undefined} bg-background shadow-sm`}>
    <div className={`flex flex-row px-1 py-0.5 w-full ${color ? color : "bg-muted"} justify-between items-center border-b`}>
      <a href={pr.head.repo.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline max-w-40 truncate text-blue-900">{pr.head.repo.name}</a>
      <div className="flex flex-row gap-0.5">
        <Badge variant='outline' className="text-xs bg-white">{waiting}</Badge>
      </div>
    </div>
    <div className={`flex flex-col p-2 w-full gap-2`}>
      <div className="flex justify-between w-full">
        <div className="text-muted-foreground cursor-pointer" onClick={() => setCurrentUser(pr.user?.login || "")}>{pr.user?.login}</div>
        {isOpen && <div className="text-muted-foreground">{info.data?.changed_files}📝 {info.data?.additions ? `+${info.data?.additions}` : ""} {info.data?.deletions ? `-${info.data?.deletions}` : ""}</div>}
      </div>
      <div><a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-900 font-semibold">{pr.title}</a></div>
      <div className="flex flex-row justify-between w-full">
        <a href={taskUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-muted-foreground">{taskId}</a>
        <div className="flex flex-row gap-1 justify-end relative">
          {(approvals > 0) && <div className={`text-xs bg-white w-4 h-4 flex items-center justify-center rounded-md ${iApproved ? "bg-green-700 text-white" : "bg-green-200"}`}>{approvals}</div>}
          {(rejections > 0) && <div className={`text-xs bg-white w-4 h-4 flex items-center justify-center rounded-md ${iRejected ? "bg-red-700 text-white" : "bg-red-200"}`}>{rejections}</div>}
        </div>
      </div>
    </div>
  </div>
}
