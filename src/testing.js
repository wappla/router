import http from 'http'
import got from 'got'
import testListen from 'test-listen'

export function createTestClient(server, options) {
    const extension = {
        prefixUrl: server.uri,
        ...options
    }
    const client = got.extend(extension)
    return client
}

export async function createTestServer(handler) {
    const server = http.createServer(handler)
    const uri = await testListen(server)
    server.uri = uri
    return server
}
