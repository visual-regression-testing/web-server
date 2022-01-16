import {GetServerSideProps, NextPage} from 'next';
import {useRouter} from 'next/router';
import useSWR from 'swr';
import {ListObjectsOutput} from "@aws-sdk/client-s3";
import config from "../../../../config/config";
import {TestInformation} from "../../../api/read";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json());

// https://stackoverflow.com/questions/68263146/next-js-doesnt-return-slug-with-userouter-in-console-log
export const getServerSideProps: GetServerSideProps<any> = async (context) => {
    let { project, baselineBranch, branch } = context.query;
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

    // now we are passing the slug to the component
    return { props: { project, baselineBranch, branch } };
};

const PullRequest: NextPage = () => {
    const bucket = config.bucket;
    const router = useRouter();
    const { project, baselineBranch, branch } = router.query as { project: string, baselineBranch: string, branch: string};
    const queryParams = new URLSearchParams({
        project: project,
        baselineBranch: baselineBranch,
        branch: branch
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
                {sortedData?.map((file, i) => file.images.map(image => <img key={i} alt={file.buildInformation.test_name} width="300" src={`https://${bucket}.s3.amazonaws.com/${image}`}/>))}
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
