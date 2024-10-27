import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("mealtracker")
    const meals = await db.collection("meals").find({ userId: session.user.id }).toArray()
    return NextResponse.json({ status: 200, data: meals })
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("mealtracker")
    const body = await request.json()
    const newMeal = await db.collection("meals").insertOne({ ...body, userId: session.user.id })
    return NextResponse.json({ status: 201, data: newMeal })
}

export async function PUT(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("mealtracker")
    const body = await request.json()
    const { _id, ...updateData } = body

    if (!_id) {
        return NextResponse.json({ error: "No id provided" }, { status: 400 })
    }

    const result = await db.collection("meals").updateOne(
        { _id: new ObjectId(_id), userId: session.user.id },
        { $set: updateData }
    )

    if (result.matchedCount === 0) {
        return NextResponse.json({ error: "Meal not found or you don't have permission to update it" }, { status: 404 })
    }

    return NextResponse.json({ status: 200, data: result })
}

export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("mealtracker")
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: "No id provided" }, { status: 400 })
    }

    const result = await db.collection("meals").deleteOne({ _id: new ObjectId(id), userId: session.user.id })

    if (result.deletedCount === 0) {
        return NextResponse.json({ error: "Meal not found or you don't have permission to delete it" }, { status: 404 })
    }

    return NextResponse.json({ status: 200, data: result })
}