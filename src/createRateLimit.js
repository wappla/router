/* eslint-disable consistent-return */
import { tooManyRequests } from './responses'

export class MemoryStore {
    constructor(window) {
        this.hits = new Map()
        this.window = window
    }

    registerHit(key) {
        const now = Date.now()
        const timestamps = this.hits.get(key) || []
        const timestampsWithinWindow = timestamps.filter((time) => (
            time + this.window > now
        ))
        const timestampsToStore = [now, ...timestampsWithinWindow]
        this.hits.set(key, timestampsToStore)
        return timestampsWithinWindow.length + 1
    }

    reset() {
        this.hits.clear()
    }
}

const defaultKeyGenerator = (req) => (
    req.headers['x-forwarded-for']
    || req.connection.remoteAddress
    || req.socket.remoteAddress
    || req.connection.socket.remoteAddress
    || null
)

export default function createRateLimit({
    window = 1000,
    limit = 1,
    keyGenerator = defaultKeyGenerator,
    onLimitReached,
    headers = false,
    store = new MemoryStore(window)
}) {
    const reset = Math.ceil(window / 1000)
    return (handler) => (req, res, ...args) => {
        const key = keyGenerator(req)
        if (!key) {
            return handler(req, res, ...args)
        }
        const hits = store.registerHit(key)
        const remaining = limit - hits
        if (headers && !res.finished && !res.headersSent) {
            res.setHeader('X-Rate-Limit-Limit', limit)
            res.setHeader('X-Rate-Limit-Remaining', Math.max(0, remaining))
            res.setHeader('X-Rate-Limit-Reset', reset)
        }
        if (remaining < 0) {
            if (typeof onLimitReached === 'function') {
                onLimitReached(req, key)
            }
            tooManyRequests(res)
            return null
        }
        return handler(req, res, ...args)
    }
}
