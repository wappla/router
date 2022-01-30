/* eslint-disable no-restricted-syntax */
import { parse } from 'url'
import UrlPattern from 'url-pattern'
import * as constants from './constants'

const {
    GET,
    POST,
    PUT,
    PATCH,
    DELETE,
    HEAD,
    OPTIONS,
} = constants

const PATTERN_OPTIONS = {
    segmentNameCharset: 'a-zA-Z0-9_-',
    segmentValueCharset: 'a-zA-Z0-9@.+-_',
}

function createRoute(methods, path, handler) {
    if (typeof path !== 'string') {
        throw new Error('You need to set a valid path.')
    }
    if (typeof handler !== 'function') {
        throw new Error('You need to set a valid handler.')
    }
    const pattern = new UrlPattern(path, PATTERN_OPTIONS)
    return (req, res, ...args) => {
        if (!methods.includes(req.method)) {
            return null
        }
        const { query, pathname } = parse(req.url, true)
        const params = pattern.match(pathname)
        if (params === null) {
            return null
        }
        return handler(
            Object.assign(req, { params, query }),
            res,
            ...args
        )
    }
}

export function get(path, handler) {
    return createRoute([GET], path, handler)
}

export function post(path, handler) {
    return createRoute([POST], path, handler)
}

export function put(path, handler) {
    return createRoute([PUT], path, handler)
}

export function patch(path, handler) {
    return createRoute([PATCH], path, handler)
}

export function del(path, handler) {
    return createRoute([DELETE], path, handler)
}

export function head(path, handler) {
    return createRoute([HEAD], path, handler)
}

export function options(path, handler) {
    return createRoute([OPTIONS], path, handler)
}

export function all(path, handler) {
    const methods = [
        GET,
        POST,
        PUT,
        PATCH,
        DELETE,
        HEAD,
        OPTIONS,
    ]
    return createRoute(methods, path, handler)
}
