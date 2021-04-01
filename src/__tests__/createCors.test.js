import createRouter from '../createRouter'
import createCors from '../createCors'
import { get } from '../routes'
import { ok } from '../responses'
import { createTestClient, createTestServer } from '../utils'

test('if \'createCors\' handles get route', async () => {
    const language = 'en'
    const handler = jest.fn((req, res) => ok(res))
    const cors = createCors({
        extendAllowHeaders: ['language'],
    })
    const server = await createTestServer(createRouter(
        get('/', cors(handler)),
    ))
    const client = await createTestClient(server, { language })
    await client.get('')
    expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
            headers: expect.objectContaining({ language }),
        }),
        expect.anything(),
    )
    server.close()
})
