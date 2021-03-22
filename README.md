# Dashdot Router

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
import router, { ok } from '@dashdot/router'

const server = http.createServer(router(
    get('/posts/:id', (req, res) => ok(res))),
    options('/posts/:id', (req, res) => ok(res))),
))

server.listen(process.env.PORT, () => {
    console.log(`Server started and listening on http://localhost:${process.env.PORT}`)
})
```