import {useSession, getSession} from "next-auth/react"
import {NextPage} from "next";
import {useRouter} from "next/router";

export async function getServerSideProps(context: any) {
    let session = await getSession(context)

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    // session isn't propagated down to component?  it doesn't matter right now as we redirect if it's not set
    return { props: { session } };
}

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json());

const Component: NextPage = ({ props }: any) => {
    const { data: session } = useSession();
    const router = useRouter()

    if (session) {
        const { projectId, buildId } = router.query;
        const queryParams = new URLSearchParams({
            projectId: projectId as string,
            buildId: buildId as string,
        });
        //
        // const { data, error } = useSWR<{project: Project, builds: Build[]}>(`/api/project?${queryParams}`, fetcher);
        //
        // if (data) {
        //     return (
        //         <div>
        //             <table>
        //                 {data.builds.map((build: Build) => <tr key={build.id}><td><a href={`/project/${projectId}/build/${build.id}`}>{build.id}</a></td></tr>)}
        //             </table>
        //         </div>
        //     )
        // }
    }

    return null;
}

export default Component;
