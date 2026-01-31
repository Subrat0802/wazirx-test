import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db"
import { Keypair } from "@solana/web3.js";

//signin signup with google

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    callbacks: {
        async signIn({user, account, profile, email, credentials}) {
            if(user.email){
                if(account?.provider === "google"){
                    const email = user.email;
                    if(!email){
                        return false
                    }
                    const userDb = await db.user.findFirst({
                        where: {
                            username: email
                        }
                    })
                    if(userDb) {
                        return true;
                    }
                    const keyPair = Keypair.generate();
                    await db.user.create({
                        data:{
                            username: email,
                            provider: "Google",
                            solWallet: {
                                create: {
                                    publickey: keyPair.publicKey.toBase58(),
                                    privateKey: keyPair.secretKey.toString()
                                }
                            },
                            ineWallet: {
                                create: {
                                    balance: 0
                                }
                            }
                        }
                    })
                }
            }
            return true;
        }
        
    }
})

export {handler as GET, handler as POST}