import createRouter from '../createRouter'
import createRateLimit, { MemoryStore } from '../createRateLimit'
import { get } from '../routes'
import { ok } from '../responses'
import { createTestClient, createTestServer } from '../testing'

test('if \'createRateLimit\' returns 429 when too many requests are performed', async () => {
    const window = 1000 // 1sec
    const store = new MemoryStore(window)
    const rateLimit = createRateLimit({
        limit: 1,
        store,
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
        store.destroy()
    }
})
