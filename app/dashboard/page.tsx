import ProfileCard from "../components/ProfileCard";
import { getServerSession } from "next-auth";
import { authConfig } from "../lib/auth";
import db from "@/app/db";
import { redirect } from "next/navigation";

export async function getUserWallet() {
  let session = null;
  try {
    session = await getServerSession(authConfig);
  } catch {
    // Session/JWT invalid (e.g. decryption failed, bad cookie) — clear it by redirecting to signout
    redirect("/api/auth/signout?callbackUrl=/");
  }

  const userWallet = await db.solWallet.findFirst({
    where: {
      userId: session?.user?.uid
    },
    select: {
      publickey: true,
    }
  })

  if(!userWallet){
    return {
      error:"No solana wallet found associated to the user"
    }
  }

  return {userWallet, error:null};
}

export default async function DashboardPage() {
  const userWallet = await getUserWallet();

  if(userWallet.error || !userWallet.userWallet?.publickey) {
    return <>No solana wallet found</>
  }

  return (
    <>
      <ProfileCard publicKey={userWallet.userWallet?.publickey} />
    </>
  );
}
