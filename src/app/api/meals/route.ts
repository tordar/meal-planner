import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
    const client = await clientPromise
    const db = client.db("mealtracker")
    const meals = await db.collection("meals").find({}).toArray()
    return NextResponse.json({ status: 200, data: meals })
}

export async function POST(request: NextRequest) {
    const client = await clientPromise
    const db = client.db("mealtracker")
    const body = await request.json()
    const newMeal = await db.collection("meals").insertOne(body)
    return NextResponse.json(newMeal)
}

export async function PUT(request: NextRequest) {
    const client = await clientPromise
    const db = client.db("mealtracker")
    const body = await request.json()
    const { _id, ...updateData } = body

    if (!_id) {
        return NextResponse.json({ error: "No id provided" }, { status: 400 })
    }

    const result = await db.collection("meals").updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
    )

    return NextResponse.json(result)
}

export async function DELETE(request: NextRequest) {
    const client = await clientPromise
    const db = client.db("mealtracker")
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: "No id provided" }, { status: 400 })
    }

    const result = await db.collection("meals").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json(result)
}