import createRouter from '../createRouter'
import { post } from '../routes'
import { createTestClient, createTestServer } from '../testing'
import { readJson, readText } from '../requests'
import {
    ok,
    json,
    badRequest,
    payloadTooLarge
} from '../responses'

const createServerWithResponse = (handleResponse, message) => (
    createTestServer(createRouter(
        post('/', (req, res) => handleResponse(req, res, message)),
    ))
)

test('if \'readJson\' handles requests correctly', async () => {
    const server = await createServerWithResponse(async (req, res) => {
        try {
            const reqJson = await readJson(req)
            return json(res, reqJson)
        } catch (e) {
            return badRequest(res)
        }
    })
    try {
        const client = await createTestClient(server)
        const resJson = { test: 'test' }
        const response = await client.post('', { json: resJson })
        expect(response.statusCode).toEqual(200)
        expect(JSON.parse(response.body).test).toEqual(resJson.test)
    } finally {
        server.close()
    }
})

test('if \'readText\' handles requests correctly', async () => {
    const server = await createServerWithResponse(async (req, res) => {
        try {
            const reqText = await readText(req)
            return ok(res, reqText)
        } catch (e) {
            return badRequest(res)
        }
    })
    try {
        const client = await createTestClient(server)
        const text = 'test'
        const response = await client.post('', { body: text })
        expect(response.statusCode).toEqual(200)
        expect(response.body).toEqual('test')
    } finally {
        server.close()
    }
})

test('if \'readText\' handles to large payload', async () => {
    const server = await createServerWithResponse(async (req, res) => {
        try {
            const limit = '1byte'
            const reqText = await readText(req, { limit })
            return ok(res, reqText)
        } catch (e) {
            if (e.type === 'entity.too.large') {
                return payloadTooLarge(res)
            }
            return badRequest(res)
        }
    })
    try {
        expect.assertions(1)
        const client = await createTestClient(server)
        const text = 'test'
        await client.post('', { body: text })
    } catch (e) {
        expect(e.response.statusCode).toEqual(413)
    } finally {
        server.close()
    }
})
