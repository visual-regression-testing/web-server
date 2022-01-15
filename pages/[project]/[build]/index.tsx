import {NextPage} from 'next';
import {useRouter} from 'next/router';
import useSWR from 'swr';
import {ListObjectsOutput} from "@aws-sdk/client-s3";

// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())

const PullRequest: NextPage = () => {

    const bucket = 'visual-regression-testing-test';
    const router = useRouter()
    const { data, error } = useSWR<ListObjectsOutput>('/api/read', fetcher)
    const { project, build } = router.query;

    if (data) {
        return (
            <>
                {data.Contents?.map(file => <img key={file.ETag} src={`https://${bucket}.s3.amazonaws.com/${file.Key}`}/>)}
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
