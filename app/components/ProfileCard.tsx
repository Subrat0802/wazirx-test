'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PrimaryButton from './Button';
import { useEffect, useState } from 'react';


const ProfileCard = ({ publicKey }: { publicKey: string }) => {
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
        <div className="w-full h-full text-wrap">
          <Greeting name={session.data?.user?.name ?? ""}/>
          <Assets publicKey={publicKey}/>
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


const Assets = ({publicKey}: {
  publicKey: string
}) => {

  const [copied, setCopiend] = useState(false);

  useEffect(() => {
    if(copied) {
      const interval = setTimeout(() => {
        setCopiend(false)
      }, 3000);
      return () => {
        clearInterval(interval);
      }
    }
  }, [copied]);

  return <div className="text-white/70 mt-3 flex justify-between items-center">
    <p className='text-2xl font-semibold'>Account assets</p>
    <div>
      <PrimaryButton onClick={() => {
        navigator.clipboard.writeText(publicKey);
        setCopiend(true);
      }}>{copied ? "copied" : "Copy address"}</PrimaryButton>
    </div>

    <div>
      
    </div>
  </div>
}