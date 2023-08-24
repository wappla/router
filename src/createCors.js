import * as constants from './constants'

const {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,
    OPTIONS,
} = constants
const DEFAULT_MAX_AGE_SECONDS = 60 * 60 * 24 // 24 hours
const DEFAULT_ALLOW_METHODS = [
    POST,
    GET,
    PUT,
    PATCH,
    DELETE,
    OPTIONS,
]
const DEFAULT_ALLOW_HEADERS = [
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'X-HTTP-Method-Override',
    'Content-Type',
    'Authorization',
    'Accept',
]

export default function createCors(corsOptions = {}) {
    return (handler) => (req, res, ...args) => {
        const {
            origin = '*',
            maxAge = DEFAULT_MAX_AGE_SECONDS,
            allowCredentials = true,
            exposeHeaders = [],
            extendAllowMethods = [],
            extendAllowHeaders = [],
        } = corsOptions
        let {
            allowMethods = DEFAULT_ALLOW_METHODS,
            allowHeaders = DEFAULT_ALLOW_HEADERS,
        } = corsOptions
        allowMethods = [...allowMethods, ...extendAllowMethods]
        allowHeaders = [...allowHeaders, ...extendAllowHeaders]
        if (res && res.finished) {
            return
        }
        if (typeof origin === 'function') {
            res.setHeader('Access-Control-Allow-Origin', origin(req))
        } else {
            res.setHeader('Access-Control-Allow-Origin', origin)
        }
        if (allowCredentials) {
            res.setHeader('Access-Control-Allow-Credentials', 'true')
        }
        if (exposeHeaders.length) {
            res.setHeader('Access-Control-Expose-Headers', exposeHeaders.join(','))
        }
        const preFlight = req.method === 'OPTIONS'
        if (preFlight) {
            res.setHeader('Access-Control-Allow-Methods', allowMethods.join(','))
            res.setHeader('Access-Control-Allow-Headers', allowHeaders.join(','))
            res.setHeader('Access-Control-Max-Age', `${maxAge}`)
        }
        // eslint-disable-next-line consistent-return
        return handler(req, res, ...args)
    }
}
