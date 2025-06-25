/** @jest-environment node */
import { MongoMemoryServer } from 'mongodb-memory-server'
import { MongoClient } from 'mongodb'
import bcrypt from 'bcrypt'

let authOptions: any

let mongo: MongoMemoryServer
let client: MongoClient

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  process.env.MONGODB_URI = mongo.getUri()
  process.env.NEXTAUTH_SECRET = 'test'
  client = new MongoClient(process.env.MONGODB_URI as string)
  await client.connect()
  const hash = await bcrypt.hash('pass', 10)
  await client.db().collection('users').insertOne({ username: 'admin', password: hash, role: 'admin' })
  const mod = await import('@/lib/auth')
  authOptions = mod.authOptions
})

afterAll(async () => {
await client.close()
await mongo.stop()
})

test('login success', async () => {
const provider: any = authOptions.providers[0]
const user = await provider.authorize({ username: 'admin', password: 'pass' })
expect(user).toMatchObject({ name: 'admin', role: 'admin' })
})

test('login failure', async () => {
const provider: any = authOptions.providers[0]
const user = await provider.authorize({ username: 'admin', password: 'bad' })
expect(user).toBeNull()
})
