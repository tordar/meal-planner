import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const client = await clientPromise
    const db = client.db("mealtracker")
    const { id } = params

    try {
        const result = await db.collection("ideas").deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Idea not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Idea deleted successfully" }, { status: 200 })
    } catch (error) {
        console.error('Error deleting idea:', error)
        return NextResponse.json({ error: "Failed to delete idea" }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const client = await clientPromise
    const db = client.db("mealtracker")
    const { id } = params

    try {
        const body = await request.json()
        const { _id, ...updateData } = body

        const result = await db.collection("ideas").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Idea not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Idea updated successfully" }, { status: 200 })
    } catch (error) {
        console.error('Error updating idea:', error)
        return NextResponse.json({ error: "Failed to update idea" }, { status: 500 })
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const client = await clientPromise
    const db = client.db("mealtracker")
    const { id } = params

    try {
        const idea = await db.collection("ideas").findOne({ _id: new ObjectId(id) })

        if (!idea) {
            return NextResponse.json({ error: "Idea not found" }, { status: 404 })
        }

        return NextResponse.json(idea)
    } catch (error) {
        console.error('Error fetching idea:', error)
        return NextResponse.json({ error: "Failed to fetch idea" }, { status: 500 })
    }
}