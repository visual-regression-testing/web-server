import {NextPage} from 'next';
import {useRouter} from 'next/router';

const PullRequest: NextPage = () => {
    const router = useRouter()
    const { project, build } = router.query

    return (
        <>
            {project} {build}
        </>
    )
}

export default PullRequest;
