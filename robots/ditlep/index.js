import getDragonsData from "./items/dragons/all/index.js"
import getAllianceChestsData from "./alliance-chests.js"
import getIslandsData from "./islands/index.js"
import getDragonTVData from "./dragon-tv.js"
import getQuestsData from "./quests.js"
import { logger } from "./settings.js"

export default (async () => {
    logger.log("Starting...")

    const content = {}

    await getIslandsData(content)
    await getQuestsData(content)
    await getAllianceChestsData(content)
    await getDragonTVData(content)
    await getDragonsData(content)
    //await getItemsData(content)

    logger.log("Finished!")
    
    return content
})