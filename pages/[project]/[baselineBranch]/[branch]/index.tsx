import {NextPage} from 'next';
import {useRouter} from 'next/router';
import useSWR from 'swr';
import {_Object, ListObjectsOutput} from "@aws-sdk/client-s3";
import config from "../../../../config/config";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

const PullRequest: NextPage = () => {

    const bucket = config.bucket;
    const router = useRouter()
    const { project, baselineBranch, branch } = router.query as { project: string, baselineBranch: string, branch: string};
    const queryParams = new URLSearchParams({
        project: project,
        baselineBranch: baselineBranch,
        // branch: branch
    });

    const { data, error } = useSWR<ListObjectsOutput>(`/api/read?${queryParams}`, fetcher)

    if (data) {
        // todo this won't work with multiple sets of images
        const sortedData = data?.Contents?.sort((a: any, b: any) => {
            // the base image gets pushed all the way to the left
            if (a.Key.match(/^[^\/]+\/[^\/]+\/([\w\-]+\.png)/)) {
                return -1;
            }

            // the diff image gets pushed far right
            if (a.Key.includes('diff')) {
                return 1;
            }

            return 0;
        });

        return (
            <>
                <div>
                    <button>Approve</button>
                </div>
                {sortedData?.map(file => <img key={file.ETag} alt={file.Key} width="300" src={`https://${bucket}.s3.amazonaws.com/${file.Key}`}/>)}
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
