import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'
import { MongoClient } from 'mongodb'

export async function GET() {
    try {
        const client: MongoClient = await clientPromise
        const db = client.db("mealtracker")
        const ideas = await db.collection("ideas").find({}).toArray()
        return NextResponse.json(ideas)
    } catch (error) {
        console.error('GET /api/ideas error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const client: MongoClient = await clientPromise
        const db = client.db("mealtracker")
        const body = await request.json()
        const newIdea = await db.collection("ideas").insertOne(body)
        return NextResponse.json(newIdea)
    } catch (error) {
        console.error('POST /api/ideas error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}