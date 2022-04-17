import {useSession, getSession} from "next-auth/client"
import {NextPage} from "next";
import {useRouter} from "next/router";
import useSWR from "swr";
import {Project} from "@visual-regression-shared/shared/helpers/listProjectsOfUser";
import {Build} from "@visual-regression-shared/shared/helpers/listBuildsOfProject";

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
    const [session] = useSession()

    const router = useRouter()
    const { projectId } = router.query
    const queryParams = new URLSearchParams({
        id: projectId as string,
    });
    const { data, error } = useSWR<{project: Project, builds: Build[]}>(`/api/project?${queryParams}`, fetcher);

    if (session) {

        if (data) {
            return (
                <div>
                    <table>
                        {data.builds.map((build: Build) => <tr key={build.id}><td><a href={`/project/${projectId}/build/${build.id}`}>{build.id}</a></td></tr>)}
                    </table>
                </div>
            )
        }
    }

    return null;
}

export default Component;
