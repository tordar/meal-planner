import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

export async function POST(request: Request) {
    const client = await clientPromise
    const db = client.db("mealtracker")
    const body = await request.json()

    if (!Array.isArray(body) || body.length === 0) {
        return NextResponse.json({ error: "Invalid input: expected a non-empty array" }, { status: 400 })
    }

    // Validate each item in the array
    const validItems = body.filter(item =>
        item.name &&
        typeof item.name === 'string' &&
        item.name.trim() !== ''
    )

    if (validItems.length === 0) {
        return NextResponse.json({ error: "No valid items to import" }, { status: 400 })
    }

    try {
        const result = await db.collection("meals").insertMany(validItems)
        return NextResponse.json({
            message: `Successfully imported ${result.insertedCount} items`,
            insertedIds: result.insertedIds
        })
    } catch (error) {
        console.error('Error during bulk insert:', error)
        return NextResponse.json({ error: "Failed to import items" }, { status: 500 })
    }
}