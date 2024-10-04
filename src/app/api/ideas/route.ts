import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'
import { MongoClient } from 'mongodb'

export async function GET() {
    const client: MongoClient = await clientPromise
    const db = client.db("mealtracker")
    const meals = await db.collection("ideas").find({}).toArray()
    return NextResponse.json({ status: 200, data: meals })
}

export async function POST(request: Request) {
    const client: MongoClient = await clientPromise
    const db = client.db("mealtracker")
    const body = await request.json()
    const newIdea = await db.collection("ideas").insertOne(body)
    return NextResponse.json(newIdea)
}