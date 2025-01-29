import { RouterOutputs } from "~/trpc/react";

export type PullRequest = RouterOutputs["pullRequests"]["getOpenPRs"][number]