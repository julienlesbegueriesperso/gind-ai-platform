import { SessionProvider } from "next-auth/react";
import React from "react";
import SigninIndex from "./signin-index";

export interface SignedContentProps {
  children: React.ReactNode
}

export function SignedContent(props:SignedContentProps) {
  return (
    <SessionProvider>
      <SigninIndex>
        {props.children}
      </SigninIndex>
    </SessionProvider>
  )
}
