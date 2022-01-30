/* eslint-disable consistent-return */
import { tooManyRequests } from './responses'

export class MemoryStore {
    constructor(window) {
        this.hits = new Map()
        this.interval = setInterval(this.reset.bind(this), window)
        process.on('SIGINT', this.destroy.bind(this))
        process.on('SIGTERM', this.destroy.bind(this))
        process.on('exit', this.destroy.bind(this))
    }

    increment(key) {
        let counter = this.hits.get(key) || 0
        counter += 1
        this.hits.set(key, counter)
        return counter
    }

    reset() {
        this.hits.clear()
    }

    destroy() {
        clearInterval(this.interval)
    }
}

const defaultKeyGenerator = (req) => (
    req.headers['x-forwarded-for']
    || req.connection.remoteAddress
    || req.socket.remoteAddress
    || req.connection.socket.remoteAddress
)

export default function createRateLimit({
    window = 1000,
    limit = 1,
    keyGenerator = defaultKeyGenerator,
    headers = false,
    store = new MemoryStore(window)
}) {
    const reset = Math.ceil(window / 1000)
    return (handler) => (req, res, ...args) => {
        const key = keyGenerator(req)
        if (!key) {
            return handler(req, res, ...args)
        }
        const remaining = limit - store.increment(key)
        if (headers && !res.finished && !res.headersSent) {
            res.setHeader('X-Rate-Limit-Limit', limit)
            res.setHeader('X-Rate-Limit-Remaining', Math.max(0, remaining))
            res.setHeader('X-Rate-Limit-Reset', reset)
        }
        if (remaining < 0) {
            tooManyRequests(res)
            return null
        }
        return handler(req, res, ...args)
    }
}
