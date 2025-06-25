/** @jest-environment node */
import { MongoMemoryServer } from 'mongodb-memory-server'
import { NextRequest } from 'next/server'

let server: MongoMemoryServer

beforeAll(async () => {
  server = await MongoMemoryServer.create()
  process.env.MONGODB_URI = server.getUri()
  jest.resetModules()
})

afterAll(async () => {
  await server.stop()
})

it('deletes an entry', async () => {
  const { getDb } = await import('@/lib/mongodb')
  const db = await getDb()
  const result = await db.collection('shiftEntries').insertOne({ foo: 'bar' })
  const id = result.insertedId.toString()

  const { DELETE } = await import('@/app/api/entries/[id]/route')
  const req = new NextRequest(`http://localhost/api/entries/${id}`, { method: 'DELETE' })
  const res = await DELETE(req, { params: { id } })
  const json = await res.json()

  expect(res.status).toBe(200)
  expect(json).toEqual({ success: true })

  const check = await db.collection('shiftEntries').findOne({ _id: result.insertedId })
  expect(check).toBeNull()
})

afterEach(async () => {
  const { getDb } = await import('@/lib/mongodb')
  const db = await getDb()
  await db.collection('shiftEntries').deleteMany({})
})
