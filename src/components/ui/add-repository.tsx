import { useState } from "react"
import { v4 as uuidv4 } from 'uuid'
import { useRepos } from "~/contexts/repos.context"

export function AddRepository() {
  const { addRepo } = useRepos()

  const [repo, setRepo] = useState("org/")

  const addRepository = () => {
    if (!repo) return
    if (repo == "") return
    const [org, name] = repo.split("/")
    if (!org || !name) return
    if (org == "" || name == "") return
    const newRepo = uuidv4()
    addRepo(newRepo, name, org)
    setRepo(org + "/")
  }

  return (
    <input type="text" placeholder="org/repo"  
      className="w-full bg-background border rounded-sm hover:bg-background/50 text-sm p-2" 
      value={repo} 
      onChange={(e) => setRepo(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          addRepository()
        }
      }}
    />
  )
}