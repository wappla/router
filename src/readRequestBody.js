export default function readRequestBody(req) {
    return new Promise((resolve, reject) => {
        const body = []
        req
            .on('data', (chunk) => body.push(chunk))
            .on('error', (error) => reject(error))
            .on('end', () => resolve(Buffer.concat(body).toString()))
    })
}
