import getDragonPagesData from "./items/dragons.js"
import { logger} from "./settings.js"

export default (async () => {
    logger.log("Starting...")
    
    const content = {}

    await getDragonPagesData(content)

    logger.log("Finished!")

    return content
})