import { useSession, signIn, signOut } from "next-auth/react"
import {NextPage} from "next";

const Component: NextPage = () => {
    const { data: session } = useSession();

    if (session) {
        return (
            <>
                Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        </>
    )
    }
    return (
        <>
            Not signed in <br />
    <button onClick={() => signIn()}>Sign in GitHub</button>
    </>
)
}

export default Component;
