'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


const ProfileCard = () => {
  
  const session = useSession();
  const router = useRouter();

  if(session.status === "loading"){
    return <div>
      Loading...
    </div>
  }

  if(!session.data?.user){
    router.push("/");
    return null;
  }

  return (
    <div className="flex max-w-7xl min-h-[80dvh] mx-auto justify-center items-center border p-20">
      <div className="w-[80%] p-20 border flex justify-center items-center">
        <div className="w-full h-full">
          <Greeting name={session.data?.user?.name ?? ""}/>
          <Assets />
        </div>
        
      </div>
    </div>
  )
}

export default ProfileCard

const Greeting = ({name}: {name: string}) => {
  return <div>
    <p className="text-2xl font-semibold">Welcome back, {name}</p>
  </div>
}


const Assets = () => {
  return <div className="text-white/70 mt-3">
    Account assets
  </div>
}