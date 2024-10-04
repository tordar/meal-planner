import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
    const client = await clientPromise
    const db = client.db("mealtracker")
    const meals = await db.collection("sides").find({}).toArray()
    return NextResponse.json({ status: 200, data: meals })
}

export async function POST(request: NextRequest) {
    const client = await clientPromise
    const db = client.db("mealtracker")
    const body = await request.json()
    const newSide = await db.collection("sides").insertOne(body)
    return NextResponse.json(newSide)
}

export async function PUT(request: NextRequest) {
    const client = await clientPromise
    const db = client.db("mealtracker")
    const body = await request.json()
    const { _id, ...updateData } = body

    if (!_id) {
        return NextResponse.json({ error: "No id provided" }, { status: 400 })
    }

    const result = await db.collection("sides").updateOne(
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

    const result = await db.collection("sides").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json(result)
}