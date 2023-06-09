import state from "../../utils/state.js"
import {
    defaultLanguage,
    dataFilePath,
    logger
} from "./settings.js"

import getLocalizationData from "./get-data.js"
import compareNewDataWithOld from "./compare-data.js"

export default (async (language = defaultLanguage) => {
    logger.log("Starting...")

    const content = { language }
    
    await getLocalizationData(content)
    await compareNewDataWithOld(content)
    await state.save(content, dataFilePath)

    logger.log("> [localization-robot] Finished!")
})