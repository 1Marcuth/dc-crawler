import { fileURLToPath } from "url"
import path from "path"

import createRobotLogger from "../../utils/robot-logger.js"

const modulePath = fileURLToPath(import.meta.url)
const currentDirectory = path.dirname(modulePath)

const dataFilePath = path.join(currentDirectory, "..", "..", "..", "data", "dbgames.json")
const baseUrl = "https://dbgames.info/dragoncity"
const logger = createRobotLogger("dbgames")

export {
    dataFilePath,
    baseUrl,
    logger
}