import { logger, dataFilePath } from "./settings.js"
import getDragonPagesData from "./items/dragons.js"
import state from "../../utils/state.js"

export default (async () => {
    logger.log("Starting...")
    
    const content = {}

    await getDragonPagesData(content)
    await state.save(content, dataFilePath)

    logger.log("Finished!")
})