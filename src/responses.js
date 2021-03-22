import * as constants from './constants'

const {
    OK,
    METHOD_NOT_ALLOWED,
    NOT_FOUND,
    BED_REQUEST,
    INTERNAL_SERVER_ERROR,
} = constants

export function ok(res, message = 'Ok') {
    res.writeHead(OK)
    res.end(message)
}

export function json(res, body, statusCode = OK) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
    })
    res.end(JSON.stringify(body))
}

export function methodNotAllowed(
    res,
    message = 'Method Not Allowed',
) {
    res.writeHead(METHOD_NOT_ALLOWED)
    res.end(message)
}

export function badRequest(
    res,
    message = 'Bad Request',
) {
    res.writeHead(BED_REQUEST)
    res.end(message)
}

export function notFound(
    res,
    message = 'Not found',
) {
    res.writeHead(NOT_FOUND)
    res.end(message)
}

export function internalServerError(
    res,
    message = 'Internal server error',
) {
    res.writeHead(INTERNAL_SERVER_ERROR)
    res.end(message)
}
