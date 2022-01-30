/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
export default function createRouter(...routes) {
    return async (req, res, ...args) => {
        for (const route of routes) {
            await route(req, res, ...args)
            if (res.headersSent) {
                return null
            }
        }
    }
}
