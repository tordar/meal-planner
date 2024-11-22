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
        const result = await db.collection("seasonal-ingredients").deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Ingredient not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Ingredient deleted successfully" }, { status: 200 })
    } catch (error) {
        console.error('Error deleting Ingredient:', error)
        return NextResponse.json({ error: "Failed to delete Ingredient" }, { status: 500 })
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

        const result = await db.collection("seasonal-ingredients").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Item updated successfully" }, { status: 200 })
    } catch (error) {
        console.error('Error updating item:', error)
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
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
        const idea = await db.collection("seasonal-ingredients").findOne({ _id: new ObjectId(id) })

        if (!idea) {
            return NextResponse.json({ error: "Ingredient not found" }, { status: 404 })
        }

        return NextResponse.json(idea)
    } catch (error) {
        console.error('Error fetching Ingredient:', error)
        return NextResponse.json({ error: "Failed to fetch Ingredient" }, { status: 500 })
    }
}