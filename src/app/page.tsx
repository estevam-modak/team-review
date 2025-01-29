'use client'
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { InlineBadgeListManager } from "~/components/ui/input-badges";
import { SimpleInput } from "~/components/ui/simple-input";
import { useReposReducer } from "~/hooks/repos.reducer";
import { api, RouterOutputs } from "~/trpc/react";
import { useQueryClient } from '@tanstack/react-query'


export default function Home() {
  const { repos, addRepo, removeRepo, openPRs, closedPRs, updateColor, colors, updateRepoPRs} = useReposReducer()
  const [currentUser, setCurrentUser] = useState<string>("")

  const queryClient = useQueryClient()

  async function fetchOpenPRs() {
    const prs = await queryClient.fetchQuery({
      queryKey: ["pullRequests", "getOpenPRs"],
      queryFn: () => api.pullRequests.getOpenPRs
    })
    console.log(prs)
  }

  useEffect(() => {
    fetchOpenPRs()
    const storedCurrentUser = localStorage.getItem("currentUser")
    if (storedCurrentUser) {
      setCurrentUser(storedCurrentUser)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("currentUser", currentUser)
  }, [currentUser])



  const drafts = openPRs.filter(pr => pr.draft) || []
  const ready = openPRs.filter(pr => !pr.draft) || []

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

  const addNewRepo = (repo: string, color: string) => {
    addRepo(repo, color)
    
  }

  return (
    <main className="flex min-h-screen flex-col">
      {repos.map(repo => <LoadPRs repo={repo} updateRepoPRs={updateRepoPRs} key={repo} />)}
      <div className="flex justify-start px-4 py-2 items-center gap-10">
        <SimpleInput value={currentUser} setValue={setCurrentUser} label="Username" />
        <InlineBadgeListManager badges={repos} removeBadge={removeRepo} addBadge={addNewRepo} colors={colors} setColor={updateColor} />
      </div>

      <div className="flex flex-col p-4 gap-16 py-16">

        <div className="flex flex-col gap-2">
          <h2 className="font-bold">Open</h2>
          <div className="flex flex-col gap-2 w-full p-4 border bg-muted">            
            <div className="flex flex-wrap gap-2 w-full">
              {today.map((pr) => <PRCard pr={pr} key={pr.id} color={colors[pr.head.repo.name]} currentUser={currentUser} setCurrentUser={setCurrentUser} />)}
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {lastWeek.map((pr) => <PRCard pr={pr} key={pr.id} color={colors[pr.head.repo.name]} currentUser={currentUser} setCurrentUser={setCurrentUser} />)}
            </div>
            <div className="flex flex-wrap gap-2 w-full">
              {others.map((pr) => <PRCard pr={pr} key={pr.id} color={colors[pr.head.repo.name]} currentUser={currentUser} setCurrentUser={setCurrentUser} />)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-sm">✅ Merged Today (last 5 PRs per repo)</h2>
          <div className="flex flex-col gap-2 w-full p-4 border bg-muted">
            <div className="flex flex-wrap gap-2 w-full">
              {closedPRs.map((pr) => <PRCard pr={pr} key={pr.id} color={colors[pr.head.repo.name]} currentUser={currentUser} setCurrentUser={setCurrentUser} />)}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-semibold text-sm">🚧 Drafts</h2>
          <div className="flex flex-col gap-2 w-full p-4 border bg-muted">
            <div className="flex flex-wrap gap-2 w-full">
              {drafts.map((pr) => <PRCard pr={pr} key={pr.id} color={colors[pr.head.repo.name]} currentUser={currentUser} setCurrentUser={setCurrentUser} />)}
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


  const initialDate = new Date(pr.created_at)
  const finalDate = pr.merged_at ? new Date(pr.merged_at) : pr.closed_at ? new Date(pr.closed_at) : new Date()
  const timeBetween = finalDate.getTime() - initialDate.getTime()
  const days = Math.floor(timeBetween / 1000 / 60 / 60 / 24)
  const hours = Math.floor(timeBetween / 1000 / 60 / 60) % 24
  const minutes = Math.floor(timeBetween / 1000 / 60) % 60
  const waiting = days > 0 ? `${days}d` : hours > 0 ? `${hours}h` : minutes > 0 ? `${minutes}m` : "now"

  const iApproved = info.data?.approvals?.find(r => r === currentUser)
  const iRejected = info.data?.rejections?.find(r => r === currentUser)
  const iHaveReviewed = iApproved || iRejected
  const imRequested = pr.requested_reviewers?.some(r => r.login === currentUser)
  const itsMine = pr.user?.login === currentUser

  const highlight = isOpen && (itsMine || iHaveReviewed || imRequested)

  const approvals = info.data?.approvals.length || 0
  const rejections = info.data?.rejections.length || 0
  

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
        {isOpen && <div className="text-muted-foreground">{info.data?.pr.changed_files}f {info.data?.pr.additions ? `+${info.data?.pr.additions}` : ""} {info.data?.pr.deletions ? `-${info.data?.pr.deletions}` : ""}</div>}
      </div>
      <div><a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-900 font-semibold">{pr.title}</a></div>
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row gap-1 justify-end relative">
          {approvals > 0 && <div className={`text-xs w-4 h-4 flex items-center justify-center rounded-md ${iApproved ? "bg-green-700 text-white" : "bg-green-200"}`}>{approvals}</div>}
          {rejections > 0 && <div className={`text-xs w-4 h-4 flex items-center justify-center rounded-md ${iRejected ? "bg-red-700 text-white" : "bg-red-200"}`}>{rejections}</div>}
        </div>
      </div>
    </div>
  </div>
}

function LoadPRs({ repo, updateRepoPRs }: { repo: string, updateRepoPRs: (repo: string, open: PullRequest[], closed: PullRequest[]) => void }) {
  const {data: prs} = api.pullRequests.getPRsByRepo.useQuery({
    repo,
  })

  useEffect(() => {
    if (prs) {
      updateRepoPRs(repo, prs.open, prs.closed)
    }
  }, [prs])

  return <></>
}
