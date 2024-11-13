'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SignInButton() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return null
    }

    if (session && session.user) {
        return (
            <div className="flex flex-col items-center space-y-2 w-full max-w-[200px] mx-auto">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={session.user.image ?? ''} alt={session.user.name ?? ''} />
                    <AvatarFallback>{session.user.name ? session.user.name[0].toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <p className="font-semibold">{session.user.name}</p>
                    <p className="text-sm text-gray-500">{session.user.email ?? 'No email provided'}</p>
                </div>
                <Button onClick={() => signOut()} variant="outline" className="w-full justify-center mt-2">
                    <User className="mr-2 h-4 w-4" />
                    Sign out
                </Button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-[200px] mx-auto">
            <Button onClick={() => signIn("google")} variant="outline" className="w-full justify-center">
                <User className="mr-2 h-4 w-4" />
                Sign in
            </Button>
        </div>
    )
}