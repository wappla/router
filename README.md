# Dashdot Router

[![build](https://github.com/wappla/router/actions/workflows/on_push_main.yml/badge.svg?branch=main)](https://github.com/wappla/router/actions/workflows/on_push_main.yml)
[![codecov](https://codecov.io/gh/wappla/router/branch/main/graph/badge.svg?token=DRM4BZC40Z)](https://codecov.io/gh/wappla/router)

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

### API

```javascript
import { createServer } from 'http'
import { createRouter, get, post, put, del, ok } from '@dashdot/router'

const { PORT, HOST } = process.env

const server = createServer(createRouter(
    get('/posts/:id', (req, res) => ok(res, req.params.id)),
    post('/posts/:id', (req, res) => ok(res, req.params.id)),
    put('/posts/:id', (req, res) => ok(res, req.params.id)),
    del('/posts/:id', (req, res) => ok(res, req.params.id)),
))

server.listen(PORT, HOST, () => {
    console.log(`Server started and listening on http://${HOST}:${PORT}`)
})
```