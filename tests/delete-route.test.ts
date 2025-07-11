/** @jest-environment node */
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient, ObjectId } from 'mongodb'

let mongo: MongoMemoryServer
let client: MongoClient
let DELETE: typeof import('@/app/api/entries/[id]/route').DELETE

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongo.getUri()
  client = new MongoClient(process.env.MONGODB_URI as string)
  await client.connect()
  const mod = await import('@/app/api/entries/[id]/route')
  DELETE = mod.DELETE
})

afterAll(async () => {
  await client.close()
  await mongo.stop()
})

test('deletes a document', async () => {
  const db = client.db()
  const result = await db.collection('shiftEntries').insertOne({ foo: 'bar' })
  const res = await DELETE({} as any, { params: { id: result.insertedId.toString() } })
  expect(res.status).toBe(200)
  const body = await res.json()
  expect(body).toEqual({ success: true })
  const found = await db.collection('shiftEntries').findOne({ _id: result.insertedId })
  expect(found).toBeNull()
})

test('invalid id', async () => {
  const res = await DELETE({} as any, { params: { id: 'bad' } })
  expect(res.status).toBe(400)
})
