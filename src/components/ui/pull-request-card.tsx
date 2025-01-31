"use client"
import * as React from "react"
import { api } from "../../trpc/react";
import { PullRequest } from "~/types";
import { useSession } from "next-auth/react";

function colorFromState(state: string) {
  if (state === "APPROVED") return "bg-green-500"
  if (state === "CHANGES_REQUESTED") return "bg-red-500"
  return "bg-yellow-500"
}

export function PRCard({ pr, repo, org  }: { 
  pr: PullRequest, 
  repo: string,
  org: string,
}) {
  const { data: session } = useSession()

  const token = session ? (session as unknown as { accessToken: string })?.accessToken : ""

  const info = api.pullRequests.getPullRequest.useQuery({
    number: pr.number,
    repo: repo,
    org: org,
    token: token || "",
  }, {})

  const initialDate = new Date(pr.created_at)
  const finalDate = pr.merged_at ? new Date(pr.merged_at) : pr.closed_at ? new Date(pr.closed_at) : new Date()
  const timeBetween = finalDate.getTime() - initialDate.getTime()
  const days = Math.floor(timeBetween / 1000 / 60 / 60 / 24)
  const hours = Math.floor(timeBetween / 1000 / 60 / 60) % 24
  const minutes = Math.floor(timeBetween / 1000 / 60) % 60
  const waiting = days > 0 ? `${days}d` : hours > 0 ? `${hours}h` : minutes > 0 ? `${minutes}m` : "now"
  const changes = `${info.data?.pr.changed_files}F ${info.data?.pr.additions ? `+${info.data?.pr.additions}` : ""} ${info.data?.pr.deletions ? `-${info.data?.pr.deletions}` : ""}`

  const reviewMap: {
    [login: string]: {state: string}
  } = {}

  info.data?.pr.requested_reviewers?.forEach(r => {
    reviewMap[r.login ?? ""] = { state: "PENDING" }
  })

  info.data?.reviews.forEach(r => {
    reviewMap[r.user?.login ?? ""] = { state: r.state }
  })

  const reviews = Object.keys(reviewMap).map(login => ({
    login,
  }))

  return <div key={pr.id} className={`w-full border flex flex-col items-start text-xs bg-background shadow-sm`}>
    <div className={`flex flex-row px-2 py-0.5 w-full bg-muted justify-between items-center border-b`}>
      <div className="text-muted-foreground cursor-pointer">{pr.user?.login}</div>
      <div className="text-muted-foreground cursor-pointer">{waiting}</div>
    </div>
    <div className={`flex flex-col p-2 w-full gap-2`}>
      <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-900">
        {pr.draft ? "[DRAFT] " : ""}{pr.title}
      </a>
      <div className="text-muted-foreground">{changes}</div>
      <div className="flex flex-col gap-1 text-muted-foreground">
        {reviews.map(r => <div key={r.login} className="text-xs items-center rounded-md flex flex-row gap-1">
          <div className={`w-2 h-2 rounded-full ${colorFromState(reviewMap[r.login]?.state ?? "PENDING")}`} />{r.login}
        </div>)}
      </div>
    </div>
  </div>
}