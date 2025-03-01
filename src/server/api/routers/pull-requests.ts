import { graphql } from "@octokit/graphql";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

type PullRequestState = "OPEN" | "MERGED" | "CLOSED"

export type PullRequest = {
  id: string;
  number: number;
  title: string;
  url: string;
  createdAt: string;
  user: string;
  state: PullRequestState;
  draft: boolean;
  changes: {
    files: number;
    additions: number;
    deletions: number;
  };
  reviews: {
    user: string;
    state: string;
  }[];

  ticketId?: string;
  ticketUrl?: string;
};

type RepositoryGraphQL = {
  repository: {
    pullRequests: {
      totalCount: number;
      nodes: Array<{
        id: string;
        number: number;
        title: string;
        url: string;
        state: string;
        createdAt: string;
        author: {
          login: string;
        };

        headRefName: string;
        isDraft: boolean;
        
        changedFiles: number;
        additions: number;
        deletions: number;

        reviewRequests: {
          nodes: Array<{
            requestedReviewer: {
              login: string;
            }
          }>;
        };

        latestReviews: {
          nodes: Array<{
            id: string;
            state: string;
            author: {
              login: string;
            };
          }>;
        };
      }>;
    };
  };
};

function mapPullRequest(pr: RepositoryGraphQL["repository"]["pullRequests"]["nodes"][number]): PullRequest {
  
  const reviewsMap = new Map<string, string>();
  pr.reviewRequests?.nodes?.forEach((reviewRequest) => {
    reviewsMap.set(reviewRequest.requestedReviewer.login, "PENDING");
  });
  pr.latestReviews.nodes.forEach((review) => {
    reviewsMap.set(review.author.login, review.state);
  });

  const state: PullRequestState = pr.state as PullRequestState;

  return {
    id: pr.id,
    number: pr.number,
    title: pr.title,
    url: pr.url,
    createdAt: pr.createdAt,
    user: pr.author.login,
    state,
    draft: pr.isDraft,
    changes: {
      files: pr.changedFiles,
      additions: pr.additions,
      deletions: pr.deletions,
    },
    reviews: Array.from(reviewsMap.entries()).map(([user, state]) => ({
      user,
      state,
    })),
  };
}

export const pullRequestsRouter = createTRPCRouter({
  getOpen: publicProcedure
    .input(
      z.object({
        repo: z.string(),
        org: z.string(),
        token: z.string(),
        page: z.number().optional(),
      }),
    )
    .query(async ({ input }): Promise<{ prs: { draft: PullRequest[], ready: PullRequest[] }, totalCount: number }> => {
      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `Bearer ${input.token}`,
        },
      });

      const { repository } = await graphqlWithAuth<RepositoryGraphQL>(`
        query getRepository($owner: String!, $repo: String!, $after: String) {
          repository(owner: $owner, name: $repo) {
            pullRequests(states: OPEN, orderBy: {field: CREATED_AT, direction: DESC}, first: 10, after: $after) {
              totalCount
              nodes {
                id
                number
                title
                url
                state
                createdAt
                isDraft
                author {
                  login
                }
                changedFiles
                additions
                deletions
                latestReviews(first: 100) {
                  nodes {
                    id
                    state
                    author {
                      login
                    }
                  }
                }
              }
            }
          }
        }
      `, {
        owner: input.org,
        repo: input.repo,
        after: input.page ? `after: "${input.page}"` : undefined,
      });

      const prs = repository.pullRequests.nodes.map((pr) => mapPullRequest(pr));

      const draft = prs.filter((pr) => pr.draft);
      const ready = prs.filter((pr) => !pr.draft);

      return {
        prs: {
          draft,
          ready,
        },
        totalCount: repository.pullRequests.totalCount,
      };
  }),

  getMerged: publicProcedure
    .input(
      z.object({
        repo: z.string(),
        org: z.string(),
        token: z.string(),
        page: z.number().optional(),
      }),
    )
    .query(async ({ input }): Promise<{ prs: PullRequest[], totalCount: number }> => {
      const graphqlWithAuth = graphql.defaults({
        headers: {
          authorization: `Bearer ${input.token}`,
        },
      });

      const { repository } = await graphqlWithAuth<RepositoryGraphQL>(`
        query getRepository($owner: String!, $repo: String!, $after: String) {
          repository(owner: $owner, name: $repo) {
            pullRequests(states: MERGED, orderBy: {field: CREATED_AT, direction: DESC}, first: 5, after: $after) {
              totalCount
              nodes {
                id
                number
                title
                url
                state
                createdAt
                isDraft
                author {
                  login
                }
                changedFiles
                additions
                deletions
                latestReviews(first: 100) {
                  nodes {
                    id
                    state
                    author {
                      login
                    }
                  }
                }
              }
            }
          }
        }
      `, {
        owner: input.org,
        repo: input.repo,
        after: input.page ? `after: "${input.page}"` : undefined,
      });

      const prs = repository.pullRequests.nodes.map((pr) => mapPullRequest(pr));

      return {
        prs,
        totalCount: repository.pullRequests.totalCount,
      };
  }),
});
