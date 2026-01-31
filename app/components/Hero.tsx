'use client'
import { useSession } from "next-auth/react"
import PrimaryButton from "./Button";
import { useRouter } from "next/navigation";

const Hero = () => {
    const session = useSession();
    const router = useRouter()
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
            <p>The indian crypto currency</p>
            <p>Revolution</p>
            <p>Create a frictionless wallet from India with google Authentication</p>
            <div>
            <p>Hello, {session.data?.user?.name}</p>
            {session.data?.user && <PrimaryButton onClick={() => router.push("/dashboard")}>Go to dashboard</PrimaryButton>}
        </div>
    </div>
  )
}

export default Hero