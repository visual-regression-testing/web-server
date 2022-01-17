import {GetServerSideProps, NextPage} from 'next';
import {useRouter} from 'next/router';
import useSWR from "swr";
import {QueryResultBuild} from "../api/getBuilds";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json());

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    let { project, baselineBranch, branch, build } = context.query;
    // If slug is "undefined", since "undefined" cannot be serialized, server will throw error
    // But null can be serializable
    if (!project) {
        // @ts-ignore
        project = null;
    }

    // now we are passing the slug to the component
    return { props: { project } };
};

const Project: NextPage = () => {
    const router = useRouter();
    const { project } = router.query as { project: string };

    const queryParams = new URLSearchParams({
        project: project,
    });

    const { data, error } = useSWR<QueryResultBuild[]>(`/api/getBuilds?${queryParams}`, fetcher);

    if (data) {
        return (<table>
            <thead>
                <tr>
                    <th>Build</th>
                    <th>Baseline/Branch</th>
                </tr>
            </thead>
            <tbody>
            {data.map((build: QueryResultBuild, idx: number) => <tr key={idx}><td><a href={`${project}/${build.baseline_branch}/${build.branch}/${build.build}`}>Build {build.build}</a></td><td>{build.baseline_branch} {'=>'} {build.branch}</td></tr>)}
            </tbody>
        </table>)
    }

    return (<span>Loading</span>)

}

export default Project;
