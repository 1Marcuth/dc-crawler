import { dataFilePath, logger } from "./settings.js"
import getIslandsData from "./islands/index.js"
import getDragonsData from "./items/dragons.js"
import state from "../../utils/state.js"

export default (async () => {
    logger.log("Starting...")

    const content = {}

    await getIslandsData(content)
    await getDragonsData(content)
    await state.save(content, dataFilePath)

    logger.log("Finished!")
})