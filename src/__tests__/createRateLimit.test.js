import createRouter from '../createRouter'
import createRateLimit, { MemoryStore } from '../createRateLimit'
import { get } from '../routes'
import { ok } from '../responses'
import { createTestClient, createTestServer, delay } from '../testing'

test('if \'createRateLimit\' returns 429 when too many requests are performed', async () => {
    const rateLimit = createRateLimit({
        limit: 1,
        window: 1000 // 1sec
    })
    const handler = jest.fn((req, res) => ok(res))
    const server = await createTestServer(createRouter(
        get('/', rateLimit(handler)),
    ))
    const retry = { limit: 0 }
    const client = await createTestClient(server, { retry })
    expect.assertions(2)
    try {
        await client.get('')
        await client.get('')
    } catch (e) {
        expect(e.response.statusCode).toEqual(429)
        expect(handler).toHaveBeenCalledTimes(1)
    } finally {
        server.close()
    }
})

test('if \'MemoryStore\' register hits correctly', async () => {
    const key = 'test'
    const store = new MemoryStore(1000) // 1sec
    const hits1 = store.registerHit(key)
    expect(hits1).toEqual(0)
    await delay(500)
    const hits2 = store.registerHit(key)
    expect(hits2).toEqual(1)
    await delay(1001)
    const hits3 = store.registerHit(key)
    expect(hits3).toEqual(0)
    store.registerHit(key)
    store.registerHit(key)
    const hits4 = store.registerHit(key)
    expect(hits4).toEqual(3)
    await delay(1001)
    const hits5 = store.registerHit(key)
    expect(hits5).toEqual(0)
})
