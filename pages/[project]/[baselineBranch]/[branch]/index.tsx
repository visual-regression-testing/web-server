import {NextPage} from 'next';
import {useRouter} from 'next/router';
import useSWR from 'swr';
import {ListObjectsOutput} from "@aws-sdk/client-s3";
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

    console.log(data);
    if (data) {
        return (
            <>
                {data.Contents?.map(file => <img key={file.ETag} alt={file.Key} width="300" src={`https://${bucket}.s3.amazonaws.com/${file.Key}`}/>)}
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
