import contentType from 'content-type'
import getRawBody from 'raw-body'

const rawBodyMap = new WeakMap()

export async function readBuffer(req, options = {}) {
    const type = req.headers['content-type'] || 'text/plain'
    const length = req.headers['content-length']
    const body = rawBodyMap.get(req)
    if (body) {
        return body
    }
    const {
        limit,
        encoding
    } = options
    const buffer = await getRawBody(req, {
        limit,
        length,
        encoding: encoding ?? contentType.parse(type).parameters.charset,
    })
    rawBodyMap.set(req, buffer)
    return buffer
}

export async function readText(req, options = {}) {
    const buffer = await readBuffer(req, options)
    return buffer.toString(options.encoding)
}

export async function readJson(req, options = {}) {
    const text = await readText(req, options)
    return JSON.parse(text)
}
