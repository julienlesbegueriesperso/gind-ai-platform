'use client'
import { GenericComponents, SignedContent, SigninIndex } from '@gind-ia-platform/generic-components';
import styles from './page.module.css';
import { SessionProvider } from "next-auth/react"


//  const SigninIndex= ()  => {
//   const { data: session } = useSession()
//   if (session) {
//     return (
//       <>
//         Signed in as {session.user?.email} <br />
//         <button onClick={() => signOut()}>Sign out</button>
//         <GenericComponents></GenericComponents>
//       </>
//     )
//   }
//   return (
//     <>
//       Not signed in <br />
//       <button onClick={() => signIn()}>Sign in</button>
//     </>
//   )
// }


  export default function Index() {
    return (
            <div>
            <SignedContent>
            <GenericComponents></GenericComponents>
            </SignedContent>
            <p>public content</p>
            </div>
    )


  }

