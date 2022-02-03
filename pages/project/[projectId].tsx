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
        const { projectId } = router.query
        return <div>{projectId}</div>
        // const queryParams = new URLSearchParams({
        //     email: session.user?.email as string
        // });
        //
        // const { data, error } = useSWR<any>(`/api/projects?${queryParams}`, fetcher);
        //
        // if (data) {
        //     return (
        //         <div>
        //             <table>
        //                 {data.map((project: Project) => <tr key={project.id}><td><a href={`/project/${project.id}`}>{project.name}</a></td></tr>)}
        //             </table>
        //         </div>
        //     )
        // }
    }

    return null;
}

export default Component;
