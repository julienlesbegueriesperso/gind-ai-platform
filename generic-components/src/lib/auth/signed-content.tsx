import { SessionProvider } from "next-auth/react";
import React from "react";
import SigninIndex from "./signin-index";

export interface SignedContentProps {
  children: React.ReactNode
  publicContent: React.ReactNode
  links: React.ReactNode
}

export function SignedContent(props:SignedContentProps) {
  return (
    <SessionProvider>
      <SigninIndex publicContent={props.publicContent} links={props.links}>
        {props.children}
      </SigninIndex>
    </SessionProvider>
  )
}
