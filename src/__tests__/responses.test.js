import createRouter from '../createRouter'
import { get } from '../routes'
import { createTestClient, createTestServer } from '../testing'
import {
    ok,
    json,
    methodNotAllowed,
    notFound,
    badRequest,
    internalServerError,
} from '../responses'

const createServerWithResponse = (handleResponse, message) => (
    createTestServer(createRouter(
        get('/', (req, res) => handleResponse(res, message)),
    ))
)

test('if \'ok\' handles response correctly', async () => {
    const message = 'Test'
    const server = await createServerWithResponse(ok, message)
    const client = await createTestClient(server)
    const response = await client.get('')
    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(message)
    server.close()
})

test('if \'json\' handles response correctly', async () => {
    const body = { key: 'Test' }
    const server = await createServerWithResponse(json, body)
    const client = await createTestClient(server)
    const response = await client.get('', { responseType: 'json' })
    expect(response.statusCode).toEqual(200)
    expect(response.body.key).toEqual(body.key)
    server.close()
})

test('if \'methodNotAllowed\' handles response correctly', async () => {
    const message = 'Test'
    const server = await createServerWithResponse(methodNotAllowed, message)
    const client = await createTestClient(server)
    expect.assertions(2)
    try {
        await client.get('')
    } catch (e) {
        expect(e.response.statusCode).toEqual(400)
        expect(e.response.body).toEqual(message)
    }
    server.close()
})

test('if \'notFound\' handles response correctly', async () => {
    const message = 'Test'
    const server = await createServerWithResponse(notFound, message)
    const client = await createTestClient(server)
    expect.assertions(2)
    try {
        await client.get('')
    } catch (e) {
        expect(e.response.statusCode).toEqual(404)
        expect(e.response.body).toEqual(message)
    }
    server.close()
})

test('if \'badRequest\' handles response correctly', async () => {
    const message = 'Test'
    const server = await createServerWithResponse(badRequest, message)
    const client = await createTestClient(server)
    expect.assertions(2)
    try {
        await client.get('')
    } catch (e) {
        expect(e.response.statusCode).toEqual(405)
        expect(e.response.body).toEqual(message)
    }
    server.close()
})

test('if \'internalServerError\' handles response correctly', async () => {
    const message = 'Test'
    const server = await createServerWithResponse(internalServerError, message)
    const client = await createTestClient(server)
    expect.assertions(2)
    try {
        await client.get('')
    } catch (e) {
        expect(e.response.statusCode).toEqual(500)
        expect(e.response.body).toEqual(message)
    }
    server.close()
})
