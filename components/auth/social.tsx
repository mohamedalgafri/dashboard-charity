"use client"

import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { Button } from "../ui/button"
import {signIn} from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { BeatLoader } from "react-spinners"

const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');


  const onClick = (provider:"google"|"github")=>{
    signIn(provider,{
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT
    })
  }

  return (
    <Suspense fallback={<BeatLoader />}>
    <div className="flex items-center w-full gap-x-2">
      <Button
        size='lg'
        className="w-full"
        variant='outline'
        onClick={() =>onClick("google")}
      >
        Google
      </Button>
      <Button
        size='lg'
        className="w-full"
        variant='outline'
        onClick={() =>onClick("github")}
      >
        Gith Hub
      </Button>
    </div>
    </Suspense>
  )
}

export default Social
