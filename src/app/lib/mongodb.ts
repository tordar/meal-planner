import { MongoClient } from 'mongodb'

// Define a type for the global object with our custom property
type GlobalWithMongo = typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
}

// Cast the global object to our custom type
const globalWithMongo = global as GlobalWithMongo

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local')
}


if (process.env.NODE_ENV === 'development') {
    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri!, options)
        globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise!
} else {
    client = new MongoClient(uri!, options)
    clientPromise = client.connect()
}

export default clientPromise