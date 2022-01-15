import {NextPage} from 'next';
import {useRouter} from 'next/router';
import useSWR from 'swr';
import {ListObjectsOutput} from "@aws-sdk/client-s3";
import config from "../../../config/config";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

const PullRequest: NextPage = () => {

    const bucket = config.bucket;
    const router = useRouter()
    const { data, error } = useSWR<ListObjectsOutput>('/api/read', fetcher)
    const { project, build } = router.query;

    if (data) {
        return (
            <>
                {data.Contents?.map(file => <img key={file.ETag} alt={file.Key} src={`https://${bucket}.s3.amazonaws.com/${file.Key}`}/>)}
            </>
        )
    }

    return (
        <>
            {project} {build}
        </>
    )
}

export default PullRequest;
