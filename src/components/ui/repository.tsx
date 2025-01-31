import { useSession } from "next-auth/react"
import { useRepos } from "~/contexts/repos.context"
import { api } from "~/trpc/react"
import { AlertCircle, X } from "lucide-react"
import { Loader2 } from "lucide-react"
import { PRCard } from "./pull-request-card"
import { Button } from "./button"


export function Repository({ id }: { id: string }) {
    const { repoMap, removeRepo, updateRepoColor } = useRepos()
    const repo = repoMap[id]

    return <div className="w-64 rounded-lg flex-shrink-0">
        <div className="flex flex-row gap-1 items-start p-1 justify-between">
            <a href={`https://github.com/${repo?.org}/${repo?.name}`} target="_blank" className="text-foreground text-sm hover:underline">{repo?.name}</a>
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
    } = api.pullRequests.getOpenPRs.useQuery({
        repo: repo?.name || "",
        org: repo?.org || "",
        token: token || "",
    }, {
        retry: false,
        enabled: repo && !!token && repo.name != "" && repo.org != "",
    })

    return <div className="w-full py-3 px-3 flex flex-col gap-3 border rounded-sm min-h-24 bg-background">
        {isFetching && <div className="flex items-center justify-center">
            <Loader2 className="size-4 animate-spin"/>
        </div>}
        {isError && <div className="flex items-center justify-center">
            <AlertCircle className="size-4"/>
        </div>}
        {
            prs && prs.map((pr) => <PRCard key={pr.id} pr={pr} repo={repo?.name || ""} org={repo?.org || ""} />)
        }
    </div>
}