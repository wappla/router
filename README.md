# Dashdot Router

[![build](https://img.shields.io/github/workflow/status/wappla/router/Build?style=flat&colorA=000000&colorB=000000)](https://github.com/wappla/router/actions/workflows/on_push_main.yml)
[![codecov](https://img.shields.io/codecov/c/github/wappla/router?style=flat&colorA=000000&colorB=000000)](https://codecov.io/gh/wappla/router)

A simple and functional Node router with some helpers.

## Usage

Inside your Node project directory, run the following:

```sh
npm i --save @dashdot/router
```

Or with Yarn:

```sh
yarn add @dashdot/router
```

## API

```javascript
import { createServer } from 'http'
import { createRouter, get, post, put, del, all, ok, notFound } from '@dashdot/router'

const { PORT, HOST } = process.env

const server = createServer(createRouter(
    get('/posts/:id', (req, res) => ok(res, req.params.id)),
    post('/posts/:id', (req, res) => ok(res, req.params.id)),
    put('/posts/:id', (req, res) => ok(res, req.params.id)),
    del('/posts/:id', (req, res) => ok(res, req.params.id)),
    all('/*', (req, res) => notFound(res)),
))

server.listen(PORT, HOST, () => {
    console.log(`Server started and listening on http://${HOST}:${PORT}`)
})
```

## Cross-Origin Resource Sharing

```javascript
const cors = createCors({
    allowMethods: ['GET'],
    extendAllowHeaders: ['trace']
})

const server = createServer(createRouter(
    get('/posts', (req, res) => cors(ok(res))),
))
```

## Rate limiting

```javascript
const rateLimit = createRateLimit({
    window: 1000, // 1 sec
    limit: 10, // 10 requests
})

const server = createServer(createRouter(
    get('/posts', (req, res) => rateLimit(ok(res))),
))
```