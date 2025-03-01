import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'
import { MongoClient } from 'mongodb'

export async function GET() {
    try {
        const client: MongoClient = await clientPromise
        const db = client.db("mealtracker")
        const meals = await db.collection("meals").find({}).toArray()
        return NextResponse.json(meals)
    } catch (error) {
        console.error('GET /api/meals error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const client: MongoClient = await clientPromise
        const db = client.db("mealtracker")
        const body = await request.json()
        const newMeal = await db.collection("meals").insertOne(body)
        return NextResponse.json(newMeal)
    } catch (error) {
        console.error('POST /api/meals error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}