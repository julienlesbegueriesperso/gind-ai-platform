import { useSession, signIn, signOut, SessionProvider } from "next-auth/react"
import React from "react"


export interface SigninIndexProps {
  children: React.ReactNode
}

export function SigninIndex(props:SigninIndexProps) {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
        {props.children}
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

export default SigninIndex
