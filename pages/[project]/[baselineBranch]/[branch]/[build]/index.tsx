import {GetServerSideProps, NextPage} from 'next';
import {useRouter} from 'next/router';
import useSWR from 'swr';
import {ListObjectsOutput} from "@aws-sdk/client-s3";
import config from "../../../../../config/config";
import {TestInformation} from "../../../../api/read";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json());

// https://stackoverflow.com/questions/68263146/next-js-doesnt-return-slug-with-userouter-in-console-log
export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    let { project, baselineBranch, branch, build } = context.query;
    // If slug is "undefined", since "undefined" cannot be serialized, server will throw error
    // But null can be serializable
    if (!project) {
        // @ts-ignore
        project = null;
    }

    if (!baselineBranch) {
        // @ts-ignore
        baselineBranch = null;
    }

    if (!branch) {
        // @ts-ignore
        branch = null;
    }

    if (!build) {
        // @ts-ignore
        build = null;
    }

    // now we are passing the slug to the component
    return { props: { project, baselineBranch, branch, build } };
};

const PullRequest: NextPage = () => {
    const bucket = config.bucket;
    const router = useRouter();
    const { project, baselineBranch, branch, build } = router.query as { project: string, baselineBranch: string, branch: string, build: string};
    const queryParams = new URLSearchParams({
        project: project,
        baselineBranch: baselineBranch,
        branch: branch,
        build: build,
    });

    const { data, error } = useSWR<TestInformation[]>(`/api/read?${queryParams}`, fetcher)

    if (data) {

        const sortedData: TestInformation[] = data.map(test => {
            test.images.sort((a: string, b: string) => {
               // the base image gets pushed all the way to the left
               if (a.match(/^[^\/]+\/[^\/]+\/([\w\-]+\.png)/)) {
                   return -1;
               }

               // the diff image gets pushed far right
               if (a.includes('diff')) {
                   return 1;
               }

               return 0;
           });

            return test;
        });

        return (
            <>
                <div>
                    <button>Approve</button>
                </div>
                <table>
                    <tr>
                        <th>Test Name</th>
                        <th>Baseline</th>
                        <th>Diff</th>
                        <th>New</th>
                    </tr>
                    {sortedData?.map((file, i) => {
                        return (
                            <tr>
                                <td>
                                    {file.buildInformation.test_name}
                                </td>
                                {file.images.map(image => <td><img key={i} alt={file.buildInformation.test_name} width="300" src={`https://${bucket}.s3.amazonaws.com/${image}`}/></td>)}
                            </tr>
                        )
                    })}
                </table>

            </>
        )
    }

    return (
        <>
            Loading
        </>
    )
}

export default PullRequest;
