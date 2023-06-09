import getIslandsData from "./islands/index.js"
import getDragonsData from "./items/dragons.js"
import { logger } from "./settings.js"

export default (async () => {
    logger.log("Starting...")

    const content = {}

    await getIslandsData(content)
    await getDragonsData(content)

    logger.log("Finished!")

    return content
})