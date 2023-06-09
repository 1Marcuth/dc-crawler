import { logger, dataFilePath } from "./settings.js"
import state from "../../utils/state.js"

import getDragonsData from "./items/dragons/all/index.js"
import getAllianceChestsData from "./alliance-chests.js"
import getIslandsData from "./islands/index.js"
import getDragonTVData from "./dragon-tv.js"
import getQuestsData from "./quests.js"

export default (async () => {
    logger.log("Starting...")

    const content = {}

    await getIslandsData(content)
    await getQuestsData(content)
    await getAllianceChestsData(content)
    await getDragonTVData(content)
    await getDragonsData(content)
    //await getItemsData(content)
    
    await state.save(content, dataFilePath)
})