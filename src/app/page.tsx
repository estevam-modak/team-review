'use client'
import { useEffect, useState } from "react";
import { SelectRepos } from "~/components/ui/select-repos";
import { SimpleInput } from "~/components/ui/simple-input";
import { useReposReducer } from "~/hooks/repos.reducer";
import { api } from "~/trpc/react";
import { useQueryClient } from '@tanstack/react-query'
import { PRCard } from "~/components/ui/pr-card";
import { PullRequest } from "~/types";



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
      <div className="flex justify-start px-4 py-2 items-center gap-10">
        <SimpleInput value={currentUser} setValue={setCurrentUser} label="Username" />
        <SelectRepos repos={repos} removeRepo={removeRepo} addRepo={addNewRepo} colors={colors} setColor={updateColor} updateRepoPRs={updateRepoPRs} />
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