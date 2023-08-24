import { jest } from '@jest/globals'
import createRouter from '../createRouter'
import createCors from '../createCors'
import { get } from '../routes'
import { ok } from '../responses'
import { createTestClient, createTestServer } from '../testing'

test('if \'createCors\' handles get route', async () => {
    const trace = '123'
    const handler = jest.fn((req, res) => ok(res))
    const cors = createCors({
        extendAllowHeaders: ['trace'],
    })
    const server = await createTestServer(createRouter(
        get('/', cors(handler)),
    ))
    const headers = { trace }
    const client = await createTestClient(server, { headers })
    await client.get('')
    expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
            headers: expect.objectContaining({ trace }),
        }),
        expect.anything(),
    )
    server.close()
})

test('if \'createCors\' can handle function as origin', async () => {
    const value = '123'
    const handler = jest.fn((req, res) => ok(res))
    const origin = jest.fn(() => value)
    const cors = createCors({
        origin,
    })
    const server = await createTestServer(createRouter(
        get('/', cors(handler)),
    ))
    const client = await createTestClient(server)
    const response = await client.get('')
    expect(origin).toHaveBeenCalled()
    expect(response.headers['access-control-allow-origin']).toEqual(value)
    server.close()
})
