import createRouter from '../createRouter.js'
import createCors from '../createCors.js'
import { get } from '../routes.js'
import { ok } from '../responses.js'
import { createTestClient, createTestServer } from '../utils.js'

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
