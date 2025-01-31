import { useSession } from "next-auth/react"
import { useRepos } from "~/contexts/repos.context"
import { api } from "~/trpc/react"
import { RefreshCw, X } from "lucide-react"
import { PRCard } from "./pull-request-card"


export function Repository({ id }: { id: string }) {
    const { repoMap, removeRepo } = useRepos()
    const repo = repoMap[id]

    return <div className="w-80 rounded-lg flex-shrink-0">
        <div className="flex flex-row gap-1 items-start p-1 justify-between pb-2">
            <a href={`https://github.com/${repo?.org}/${repo?.name}`} target="_blank" className="text-foreground text-sm hover:underline">{repo?.org}/{repo?.name}</a>
            <button className="text-muted-foreground hover:text-foreground opacity-50 hover:opacity-100" onClick={() => removeRepo(id)}><X className="size-4"/></button>
        </div>
        <PRs id={id} />
    </div>
}

function PRs({ id }: { id: string }) {
    const {data: session} = useSession()
    const { repoMap } = useRepos()
    const token = session ? (session as unknown as { accessToken: string })?.accessToken : undefined
    const repo = repoMap[id]

    const {
        data: prs,
        isFetching,
        isError,
        dataUpdatedAt,
        refetch
    } = api.pullRequests.getOpenPRs.useQuery({
        repo: repo?.name || "",
        org: repo?.org || "",
        token: token || "",
    }, {
        retry: false,
        enabled: repo && !!token && repo.name != "" && repo.org != "",
    })

    const text = isFetching ? "Loading..." : 
        isError ? "Error fetching" : 
        "Last update at " + new Date(dataUpdatedAt).toLocaleString("en-UK", { hour: '2-digit', minute: '2-digit' })

    return <div className="w-full py-3 px-3 flex flex-col gap-3 border rounded-sm min-h-24 bg-background">
        <div className="flex flex-row gap-2 items-center justify-center text-xs text-muted-foreground/50">
            {text}
            {!isFetching && <button className="text-muted-foreground hover:text-blue-500 opacity-50 hover:opacity-100" onClick={() => refetch()}>
                <RefreshCw className="size-3"/>
            </button>}
        </div>
        {
            prs && prs.map((pr) => <PRCard key={pr.id} pr={pr} repo={repo?.name || ""} org={repo?.org || ""} />)
        }
    </div>
}