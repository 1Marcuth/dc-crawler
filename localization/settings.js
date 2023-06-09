import { fileURLToPath } from "url"
import path from "path"

import createRobotLogger from "../../utils/robot-logger.js"

const modulePath = fileURLToPath(import.meta.url)
const currentDirectory = path.dirname(modulePath)

const dataFilePath = path.join(currentDirectory, "..", "..", "..", "data", "localization.json")
const logger = createRobotLogger("localization")
const defaultLanguage = "en"

export {
    defaultLanguage,
    dataFilePath,
    logger
}