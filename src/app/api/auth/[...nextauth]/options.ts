import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import { NextAuthOptions } from "next-auth"
import { AdapterUser } from "next-auth/adapters"
import { Session } from "next-auth"

interface CustomSession extends Session {
    user?: {
        id?: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
        async session({ session, user }: { session: CustomSession; user: AdapterUser }) {
            if (session.user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
}