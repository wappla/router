import { createServer } from 'http'
import { creatRouter, get, post, put, del, ok } from '@dashdot/router/index.js'

const {
    PORT = 3000,
    HOST = 'localhost'
} = process.env

const server = createServer(creatRouter(
    get('/posts/:id', (req, res) => ok(res, req.params.id)),
    post('/posts/:id', (req, res) => ok(res, req.params.id)),
    put('/posts/:id', (req, res) => ok(res, req.params.id)),
    del('/posts/:id', (req, res) => ok(res, req.params.id)),
))

server.listen(PORT, HOST, () => {
    console.log(`Server started and listening on http://${HOST}:${PORT}`)
})
