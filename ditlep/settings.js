import { fileURLToPath } from "url"
import path from "path"

import createRobotLogger from "../../utils/robot-logger.js"

const modulePath = fileURLToPath(import.meta.url)
const currentDirectory = path.dirname(modulePath)

const dataFilePath = path.join(currentDirectory, "..", "..", "..", "data", "ditlep.json")
const baseUrl = "https://ditlep.com"
const logger = createRobotLogger("ditlep")

export {
    dataFilePath,
    baseUrl,
    logger
}