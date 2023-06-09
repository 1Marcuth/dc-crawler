import { fileURLToPath } from "url"
import path from "path"

import createRobotLogger from "../../utils/robot-logger.js"

const dragonElementsNames = {"w":"water","p":"plant","f":"fire","d":"dark","e":"earth","el":"electric","m":"metal","i":"ice","wr":"war","l":"legend","li":"light","pu":"pure","bt":"beauty","ch":"chaos","mg":"magic","hp":"happiness","dr":"dream","so":"soul","pr":"primal","wd":"wind","ti":"time"}

const modulePath = fileURLToPath(import.meta.url)
const currentDirectory = path.dirname(modulePath)

const dataFilePath = path.join(currentDirectory, "..", "..", "..", "data", "deetlist.json")
const baseUrl = "https://deetlist.com/dragoncity"
const logger = createRobotLogger("deetlist")

export {
    dragonElementsNames,
    dataFilePath,
    baseUrl,
    logger
}