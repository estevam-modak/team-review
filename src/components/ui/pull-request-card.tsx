"use client";
import * as React from "react";
import { api } from "../../trpc/react";
import { PullRequest } from "~/types";
import { useSession } from "next-auth/react";
import { useRepos } from "~/contexts/repos.context";

function colorFromState(state: string) {
  if (state === "APPROVED") return "bg-green-500";
  if (state === "CHANGES_REQUESTED") return "bg-red-500";
  return "bg-yellow-500";
}

export function PRCard({
  pr,
  repo,
  org,
}: {
  pr: PullRequest;
  repo: string;
  org: string;
}) {
  const { selectedUser } = useRepos();
  const { data: session } = useSession();
  const token = session
    ? (session as unknown as { accessToken: string })?.accessToken
    : "";

  const info = api.pullRequests.getPullRequest.useQuery(
    {
      number: pr.number,
      repo: repo,
      org: org,
      token: token || "",
    },
    {},
  );

  const initialDate = new Date(pr.created_at);
  const finalDate = pr.merged_at
    ? new Date(pr.merged_at)
    : pr.closed_at
      ? new Date(pr.closed_at)
      : new Date();
  const timeBetween = finalDate.getTime() - initialDate.getTime();
  const days = Math.floor(timeBetween / 1000 / 60 / 60 / 24);
  const hours = Math.floor(timeBetween / 1000 / 60 / 60) % 24;
  const minutes = Math.floor(timeBetween / 1000 / 60) % 60;
  const waiting =
    days > 0
      ? `${days}d`
      : hours > 0
        ? `${hours}h`
        : minutes > 0
          ? `${minutes}m`
          : "now";
  const changes = `${info.data?.pr.changed_files}F ${info.data?.pr.additions ? `+${info.data?.pr.additions}` : ""} ${info.data?.pr.deletions ? `-${info.data?.pr.deletions}` : ""}`;

  const reviewMap: {
    [login: string]: { state: string };
  } = {};

  info.data?.pr.requested_reviewers?.forEach((r) => {
    reviewMap[r.login ?? ""] = { state: "PENDING" };
  });

  info.data?.reviews.forEach((r) => {
    reviewMap[r.user?.login ?? ""] = { state: r.state };
  });

  const reviews = Object.keys(reviewMap).map((login) => ({
    login,
  }));

  const isUserRelated =
    selectedUser === pr.user?.login ||
    reviews.some((r) => r.login === selectedUser);

  if (selectedUser !== "" && !isUserRelated) return null;

  return (
    <div
      key={pr.id}
      className={`flex w-full flex-col items-start border bg-background text-xs text-muted-foreground shadow-sm`}
    >
      <div
        className={`flex w-full flex-row items-center justify-between border-b bg-muted px-2 py-0.5`}
      >
        <SelectableUser user={pr.user?.login ?? ""} />
        <div className="cursor-pointer">{waiting}</div>
      </div>
      <div className={`flex w-full flex-col gap-2 p-2`}>
        <a
          href={pr.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-900 hover:underline"
        >
          {pr.draft ? "[DRAFT] " : ""}
          {pr.title}
        </a>
        <div>{changes}</div>
        <div className="flex flex-col gap-1">
          {reviews.map((r) => (
            <div
              key={r.login}
              className="flex flex-row items-center gap-1 rounded-md text-xs"
            >
              <div
                className={`h-2 w-2 rounded-full ${colorFromState(reviewMap[r.login]?.state ?? "PENDING")}`}
              />
              <SelectableUser user={r.login} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SelectableUser({ user }: { user: string }) {
  const { selectedUser, setSelectedUser } = useRepos();

  const isSelected = selectedUser === user;

  const click = () => {
    if (!isSelected) {
      setSelectedUser(user);
    } else {
      setSelectedUser("");
    }
  };

  return (
    <div
      className={`cursor-pointer hover:text-blue-500 ${isSelected ? "font-semibold text-blue-500" : ""}`}
      onClick={click}
    >
      {user}
    </div>
  );
}
