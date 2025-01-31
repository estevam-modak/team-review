import { request } from "@octokit/request";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const pullRequestsRouter = createTRPCRouter({
  getOpenPRs: publicProcedure.input(z.object({
    repo: z.string(),
    org: z.string(),
    token: z.string(),
  })).query(async ({ input }) => {
    const response = await request<"GET /repos/{owner}/{repo}/pulls">("GET /repos/{owner}/{repo}/pulls", {
      headers: {
        Authorization: `Bearer ${input.token}`,
      },
      owner: input.org,
      repo: input.repo,
      state: 'open',
      direction: 'desc',
    })

    return response.data
  }),

  getPullRequest: publicProcedure.input(z.object({
    token: z.string(),
    org: z.string(),
    repo: z.string(),
    number: z.number(),
  })).query(async ({ input }) => {
    const { data: pr } = await request<"GET /repos/{owner}/{repo}/pulls/{pull_number}">("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
      headers: {
        Authorization: `Bearer ${input.token}`,
      },
      owner: input.org,
      repo: input.repo,
      pull_number: input.number,
    })

    const { data: reviews } = await request<"GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews">("GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
      headers: {
        Authorization: `Bearer ${input.token}`,
      },
      owner: input.org,
      repo: input.repo,
      pull_number: input.number,
    })


    const branch = pr.head.ref
    const team = branch.split("-")[0] ?? ""
    const task = branch.split("-")[1] ?? ""
    const taskId = `${team}-${task}`
    const taskUrl = `https://modaklive.atlassian.net/browse/${taskId}`

    const additional = {
      taskId,
      taskUrl,
    }

    const approvals = reviews.filter(r => r.state === 'APPROVED').map(r => r.user?.login ?? "") ?? []
    const rejections = reviews.filter(r => r.state === "CHANGES_REQUESTED").map(r => r.user?.login ?? "") ?? []

    return {
      pr,
      additional,
      approvals,
      rejections,
    }
  }),
});
