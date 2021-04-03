import createRouter from '../createRouter.js'
import {
    get,
    post,
    put,
    patch,
    del,
    head,
} from '../routes.js'
import { ok } from '../responses.js'
import { createTestClient, createTestServer } from '../utils.js'

const createOkHandler = (message) => (req, res) => ok(res, message)

test('if router handles get route', async () => {
    const message = 'Test'
    const server = await createTestServer(createRouter(
        get('/', createOkHandler(message)),
    ))
    const client = await createTestClient(server)
    const response = await client.get('')
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(message)
    server.close()
})

test('if router calls correct handlers', async () => {
    const message = 'Test'
    const handler = jest.fn(createOkHandler(message))
    const postHandler = jest.fn(createOkHandler(message))
    const otherHandler = jest.fn(createOkHandler(message))
    const server = await createTestServer(createRouter(
        get('/test', handler),
        post('/test', postHandler),
        get('/other', otherHandler),
    ))
    const client = await createTestClient(server)
    const response = await client.get('test')
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(message)
    expect(handler).toHaveBeenCalled()
    expect(postHandler).not.toHaveBeenCalled()
    expect(otherHandler).not.toHaveBeenCalled()
    server.close()
})

test('if router adds \'params\' to req', async () => {
    const id = '1'
    const handler = jest.fn(createOkHandler())
    const server = await createTestServer(createRouter(
        get('/test/:id', handler),
    ))
    const client = await createTestClient(server)
    await client.get(`test/${id}`)
    expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
            params: { id },
        }),
        expect.anything(),
    )
    server.close()
})

test('if router adds \'query\' to req', async () => {
    const id = '1'
    const handler = jest.fn(createOkHandler())
    const server = await createTestServer(createRouter(
        get('/test', handler),
    ))
    const client = await createTestClient(server)
    await client.get(`test?id=${id}`)
    expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
            query: { id: '1' },
        }),
        expect.anything(),
    )
    server.close()
})

test('if all route creators handle correctly', async () => {
    const handler = createOkHandler()
    const getHandler = jest.fn(handler)
    const postHandler = jest.fn(handler)
    const putHandler = jest.fn(handler)
    const patchHandler = jest.fn(handler)
    const delHandler = jest.fn(handler)
    const headHandler = jest.fn(handler)
    const server = await createTestServer(createRouter(
        get('/', getHandler),
        post('/', postHandler),
        put('/', putHandler),
        patch('/', patchHandler),
        del('/', delHandler),
        head('/', headHandler),
    ))
    const client = await createTestClient(server)
    const responses = await Promise.all([
        client.head(''),
        client.get(''),
        client.post(''),
        client.put(''),
        client.patch(''),
        client.delete(''),
    ])
    responses.forEach(({ statusCode }) => {
        expect(statusCode).toEqual(200)
    })
    server.close()
})
