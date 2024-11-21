import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'
import { MongoClient } from 'mongodb'

export async function GET() {
    try {
        const client: MongoClient = await clientPromise
        const db = client.db("mealtracker")
        const sides = await db.collection("sides").find({}).toArray()
        return NextResponse.json(sides)
    } catch (error) {
        console.error('GET /api/sides error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const client: MongoClient = await clientPromise
        const db = client.db("mealtracker")
        const body = await request.json()
        const newSide = await db.collection("sides").insertOne(body)
        return NextResponse.json(newSide)
    } catch (error) {
        console.error('POST /api/sides error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}