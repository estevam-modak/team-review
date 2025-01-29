import { request } from "@octokit/request";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const TOKEN = process.env.GITHUB_API_TOKEN
const ORG = "modak-live"
const headers = {
  Authorization: `Bearer ${TOKEN}`,
}

export const pullRequestsRouter = createTRPCRouter({
  getPRsByRepo: publicProcedure.input(z.object({
    repo: z.string(),
  })).query(async ({ input }) => {
    const {data: open} = await request<"GET /repos/{owner}/{repo}/pulls">("GET /repos/{owner}/{repo}/pulls", {
      headers,
      owner: ORG,
      repo: input.repo,
      state: 'open',
      direction: 'desc',
    })

    const {data: closed} = await request<"GET /repos/{owner}/{repo}/pulls">("GET /repos/{owner}/{repo}/pulls", {
      headers,
      owner: ORG,
      repo: input.repo,
      state: 'closed',
      sort: 'created',
      per_page: 5,
      direction: 'desc',
    })

    return {
      open,
      closed,
    }
  }),

  getOpenPRs: publicProcedure.input(z.object({
    repos: z.array(z.string())
  })).query(async ({ input }) => {
    const prs = []
    for (const repo of input.repos) {
      const response = await request<"GET /repos/{owner}/{repo}/pulls">("GET /repos/{owner}/{repo}/pulls", {
        headers,
        owner: ORG,
        repo,
        state: 'open',
        direction: 'desc',
      })
      prs.push(...response.data)
    }

    const ordered = prs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return ordered
  }),

  getLast5MergedPRs: publicProcedure.input(z.object({
    repos: z.array(z.string())
  })).query(async ({ input }) => {
    const prs = []
    for (const repo of input.repos) {
      const response = await request<"GET /repos/{owner}/{repo}/pulls">("GET /repos/{owner}/{repo}/pulls", {
        headers,
        owner: ORG,
        repo,
        state: 'closed',
        sort: 'created',
        per_page: 5,
        direction: 'desc',
      })
      prs.push(...response.data)
    }

    const filtered = prs.filter((pr) => new Date(pr.updated_at).toDateString() === new Date().toDateString() && pr.merged_at)
    const ordered = filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    return ordered
  }),

  getPullRequest: publicProcedure.input(z.object({
    repo: z.string(),
    number: z.number(),
  })).query(async ({ input }) => {
    const { data: pr } = await request<"GET /repos/{owner}/{repo}/pulls/{pull_number}">("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
      headers,
      owner: ORG,
      repo: input.repo,
      pull_number: input.number,
    })

    const { data: reviews } = await request<"GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews">("GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
      headers,
      owner: ORG,
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
