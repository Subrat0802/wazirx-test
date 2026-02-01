'use client'
import { signIn, signOut, useSession } from "next-auth/react"
import PrimaryButton from "./Button"


const Appbar = () => {
    const session = useSession();
  return (
    <div className="border-b px-2 py-2 flex justify-between">
        <div>
            DCEX
        </div>
        <div>
            {session.data?.user ? <PrimaryButton onClick={() => signOut()}>Logout</PrimaryButton> : <PrimaryButton onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}>Sign in</PrimaryButton>}
        </div>

       
    </div>
  )
}

export default Appbar