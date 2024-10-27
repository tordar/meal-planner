'use client'

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function SignInButton() {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return <Button disabled>Loading...</Button>
    }

    if (session) {
        return (
            <Button onClick={() => signOut()} variant="outline" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Sign out
            </Button>
        )
    }

    return (
        <Button onClick={() => signIn("google")} variant="outline" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Sign in
        </Button>
    )
}