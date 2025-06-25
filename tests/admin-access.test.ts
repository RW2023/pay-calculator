/** @jest-environment node */
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'
import { getServerSession } from 'next-auth'

jest.mock('next-auth')

let mongo: MongoMemoryServer
let client: MongoClient
let GET: typeof import('@/app/api/entries/route').GET
const mocked = getServerSession as jest.Mock

beforeAll(async () => {
 mongo = await MongoMemoryServer.create()
 process.env.MONGODB_URI = mongo.getUri()
 process.env.NEXTAUTH_SECRET = 'test'
 client = new MongoClient(process.env.MONGODB_URI as string)
 await client.connect()
 await client.db().collection('shiftEntries').insertOne({ days: [], hasPension: false, hasUnionDues: false, createdAt: new Date() })
 const mod = await import('@/app/api/entries/route')
 GET = mod.GET
})

afterAll(async () => {
await client.close()
await mongo.stop()
})

function makeReq () {
return { nextUrl: { searchParams: new URLSearchParams() } } as any
}

test('unauthenticated denied', async () => {
mocked.mockResolvedValueOnce(null)
const res = await GET(makeReq())
expect(res.status).toBe(401)
})

test('non-admin denied', async () => {
mocked.mockResolvedValueOnce({ user: { role: 'user' } })
const res = await GET(makeReq())
expect(res.status).toBe(401)
})

test('admin allowed', async () => {
mocked.mockResolvedValueOnce({ user: { role: 'admin' } })
const res = await GET(makeReq())
expect(res.status).toBe(200)
})
