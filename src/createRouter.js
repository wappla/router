/* eslint-disable no-restricted-syntax */
export default function createRouter(...routes) {
    return (req, res) => {
        for (const route of routes) {
            route(req, res)
        }
    }
}
