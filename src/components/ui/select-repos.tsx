import * as React from "react"

import { useEffect, useState } from "react"
import { Plus, X } from "lucide-react"
import { api } from "~/trpc/react"
import { PullRequest } from "~/types"

const COLORS = ["bg-red-100", "bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-purple-100", "bg-pink-100", "bg-orange-100", "bg-gray-100"]

const nextColor = (color: string) => {
  const index = COLORS.indexOf(color)
  const next = COLORS[(index + 1) % COLORS.length] || "bg-muted" 
  return next
}

export function SelectRepos({ repos, removeRepo, addRepo, colors, setColor, updateRepoPRs }: { 
    repos: string[], 
    removeRepo: (repo: string) => void,
    addRepo: (repo: string, color: string) => void,
    colors: { [key: string]: string },
    setColor: (repo: string, color: string) => void,
    updateRepoPRs: (repo: string, open: PullRequest[], closed: PullRequest[]) => void
  }) {

  const [isAdding, setIsAdding] = useState(false)
  const [newRepoText, setNewRepoText] = useState("")

  const addNewRepo = () => {
    if (newRepoText.trim() !== "") {
      addRepo(newRepoText.trim(), "bg-muted")
      setNewRepoText("")
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {repos.map((repo, index) => (
        <Repo repo={repo} color={colors[repo] ?? "bg-muted"} setColor={setColor} removeRepo={removeRepo} key={index} updateRepoPRs={updateRepoPRs} />
      ))}
      {!isAdding ? (
        <button className="h-6 p-0 opacity-50 hover:opacity-100 flex items-center gap-1 text-xs" onClick={() => setIsAdding(true)}>
          <Plus className="h-3 w-3" /> Repo
        </button>
      ) : (
        <div className="flex items-center">
          <input
            type="text"
            placeholder="New repo"
            className="h-6 p-2 bg-muted w-32 text-xs rounded-md"
            value={newRepoText}
            onChange={(e) => setNewRepoText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addNewRepo()
              } else if (e.key === "Escape") {
                setIsAdding(false)
              }
            }}
        />
       </div>
      )}
    </div>
  )
}

function Repo({ repo, color, setColor, removeRepo, updateRepoPRs }: { 
  repo: string, 
  color: string, 
  setColor: (repo: string, color: string) => void, 
  removeRepo: (repo: string) => void,
  updateRepoPRs: (repo: string, open: PullRequest[], closed: PullRequest[]) => void
}) {
  const { data: prs } = api.pullRequests.getPRsByRepo.useQuery({
    repo: repo,
  })

  useEffect(() => {
    if (prs) {
      updateRepoPRs(repo, prs.open, prs.closed)
    }
  }, [prs])
  
  const onClickNextColor = () => {
    const next = nextColor(color)
    setColor(repo, next)
  }
  
  return <div className={`text-xs cursor-pointer flex items-center gap-1 h-6 px-2 py-1 rounded-md ${color ?? "bg-muted"}`} onClick={onClickNextColor}>
    {repo}
    <button className="p-0 opacity-50 hover:opacity-100" onClick={() => removeRepo(repo)}>
      <X className="h-3 w-3" />
    </button>
  </div>
}
