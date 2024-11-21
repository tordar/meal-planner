import { NextResponse } from 'next/server'
import clientPromise from '../../lib/mongodb'
import { MongoClient } from 'mongodb'

export async function GET() {
    try {
        const client: MongoClient = await clientPromise
        const db = client.db("mealtracker")
        const seasonalIngredients = await db.collection("seasonal-ingredients").find({}).toArray()
        return NextResponse.json(seasonalIngredients)
    } catch (error) {
        console.error('GET /api/seasonal-ingredients error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const client: MongoClient = await clientPromise
        const db = client.db("mealtracker")
        const body = await request.json()
        const newSeasonalIngredient = await db.collection("seasonal-ingredients").insertOne(body)
        return NextResponse.json(newSeasonalIngredient)
    } catch (error) {
        console.error('POST /api/seasonal-ingredients error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}