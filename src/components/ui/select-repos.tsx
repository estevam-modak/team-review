import * as React from "react";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { api } from "~/trpc/react";
import { useRepos } from "~/contexts/repos.context";

const COLORS = [
  "bg-red-100",
  "bg-blue-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-orange-100",
  "bg-gray-100",
];

const nextColor = (color: string) => {
  const index = COLORS.indexOf(color);
  const next = COLORS[(index + 1) % COLORS.length] || "bg-muted";
  return next;
};

export function SelectRepos() {
  const { repos, addRepo } = useRepos();

  const [isAdding, setIsAdding] = useState(false);
  const [newRepoText, setNewRepoText] = useState("");

  const addNewRepo = () => {
    if (newRepoText.trim() !== "") {
      addRepo(newRepoText.trim(), "bg-muted");
      setNewRepoText("");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {repos.map((repo) => (
        <Repo repo={repo} key={repo} />
      ))}
      {!isAdding ? (
        <button
          className="flex h-6 items-center gap-1 p-0 text-xs opacity-50 hover:opacity-100"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-3 w-3" /> Repo
        </button>
      ) : (
        <div className="flex items-center">
          <input
            type="text"
            placeholder="New repo"
            className="h-6 w-32 rounded-md bg-muted p-2 text-xs"
            value={newRepoText}
            onChange={(e) => setNewRepoText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addNewRepo();
              } else if (e.key === "Escape") {
                setIsAdding(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

function Repo({ repo }: { repo: string }) {
  const { colors, updateColor, removeRepo, updateRepoPRs } = useRepos();

  const color = colors[repo] ?? "bg-muted";

  const onClickNextColor = () => {
    const next = nextColor(color);
    updateColor(repo, next);
  };

  return (
    <div
      className={`flex h-6 cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs ${colors[repo] ?? "bg-muted"}`}
      onClick={onClickNextColor}
    >
      {repo}
      <button
        className="p-0 opacity-50 hover:opacity-100"
        onClick={() => removeRepo(repo)}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
