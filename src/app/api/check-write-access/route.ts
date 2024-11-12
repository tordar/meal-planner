import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]/options'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
        return NextResponse.json({ hasAccess: false }, { status: 401 })
    }

    const hasAccess = session.user.email === process.env.ADMIN_EMAIL

    return NextResponse.json({ hasAccess })
}