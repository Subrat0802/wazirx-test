import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db";
import { Provider } from "@prisma/client";
import { Keypair } from "@solana/web3.js";
import NextAuth, { Session } from "next-auth";

if (!process.env.NEXTAUTH_SECRET) {
  console.error(
    "[next-auth] NEXTAUTH_SECRET is missing. Add to .env: NEXTAUTH_SECRET=<run: openssl rand -base64 32>"
  );
}

export interface session extends Session {
    user: {
        email: string,
        name: string,
        uid: string,
    }
}

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],

  callbacks: {
    async session({ session, token }) {
      const s = session as session;
      if (s.user && token.uid) {
        s.user.uid = token.uid as string;
      }
      return s;
    },

    async jwt({ token, account }) {
      // On first sign-in, account and user are present — look up our DB user and set uid
      if (account?.providerAccountId) {
        const dbUser = await db.user.findFirst({
          where: { sub: account.providerAccountId },
        });
        if (dbUser) token.uid = dbUser.id;
      }
      return token;
    },

    async signIn({ user, account }) {
      if (!user.email || account?.provider !== "google") return false;

      const existingUser = await db.user.findFirst({
        where: { username: user.email },
      });

      if (existingUser) return true;

      const keypair = Keypair.generate();

      try {
        await db.user.create({
          data: {
            username: user.email,
            provider: Provider.Google,
            sub: account.providerAccountId,
            solWallet: {
              create: {
                publickey: keypair.publicKey.toBase58(),
                privateKey: Buffer.from(keypair.secretKey).toString("base64"),
              },
            },
            ineWallet: {
              create: { balance: 0 },
            },
          },
        });
      } catch (err) {
        console.error("[next-auth] signIn create user failed:", err);
        return false;
      }

      return true;
    },

    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
}

const handler = NextAuth(authConfig)
export { handler as GET, handler as POST }
