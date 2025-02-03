import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRepos } from "~/contexts/repos.context";
import { Input } from "./input";
import { Button } from "./button";
import { PlusIcon } from "lucide-react";

export function AddRepository() {
  const { addRepo } = useRepos();

  const [repo, setRepo] = useState("");

  const addRepository = () => {
    if (!repo) return;
    if (repo == "") return;
    const [org, name] = repo.split("/");
    if (!org || !name) return;
    if (org == "" || name == "") return;
    const newRepo = uuidv4();
    addRepo(newRepo, name, org);
  };

  return (
    <div className="flex items-center relative w-72">
      <Input
        id="repo"
        type="text"
        placeholder="org/repo"
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addRepository();
          }
        }}
      />
      <button
        className="text-muted-foreground hover:text-primary absolute right-2 w-6 h-6 rounded-full flex items-center justify-center bg-muted"
        onClick={addRepository}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
}
