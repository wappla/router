const { createServer } = require('http')
const {
    creatRouter,
    get,
    post,
    ok
} = require('@dashdot/router')

const {
    PORT = 3000,
    HOST = 'localhost'
} = process.env

const server = createServer(creatRouter(
    get('/posts/:id', (req, res) => ok(res, req.params.id)),
    post('/posts/:id', (req, res) => ok(res, req.params.id)),
))

server.listen(PORT, HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Server started and listening on http://${HOST}:${PORT}`)
})
