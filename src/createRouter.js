/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
export default function createRouter(...routes) {
    return async (req, res) => {
        for (const route of routes) {
            await route(req, res)
            if (res.headersSent) {
                return
            }
        }
    }
}
