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
        const result = await db.collection("meals").deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Meal not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Meal deleted successfully" }, { status: 200 })
    } catch (error) {
        console.error('Error deleting meal:', error)
        return NextResponse.json({ error: "Failed to delete meal" }, { status: 500 })
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

        // Ensure the _id in the body matches the id in the URL
        if (_id && _id !== id) {
            return NextResponse.json({ error: "ID mismatch" }, { status: 400 })
        }

        const result = await db.collection("meals").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Meal not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Meal updated successfully" }, { status: 200 })
    } catch (error) {
        console.error('Error updating meal:', error)
        return NextResponse.json({ error: "Failed to update meal" }, { status: 500 })
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
        const meal = await db.collection("meals").findOne({ _id: new ObjectId(id) })

        if (!meal) {
            return NextResponse.json({ error: "Meal not found" }, { status: 404 })
        }

        return NextResponse.json(meal)
    } catch (error) {
        console.error('Error fetching meal:', error)
        return NextResponse.json({ error: "Failed to fetch meal" }, { status: 500 })
    }
}