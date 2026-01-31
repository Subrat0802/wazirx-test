import { useSession } from "next-auth/react";
import ProfileCard from "../components/ProfileCard";
import { getServerSession } from "next-auth";


export async function getBalance() {
  const session = await getServerSession(authCon);
}

export default async function DashboardPage() {
  return (
    <>
      <ProfileCard />
    </>
  );
}
