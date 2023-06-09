import { toTitleCase } from "./text.js"

function parseIslandName(rawIslandName) {
    return toTitleCase(rawIslandName).trim()
}

export { parseIslandName }