import { defaultLanguage, logger } from "./settings.js"

import compareNewDataWithOld from "./compare-data.js"
import getLocalizationData from "./get-data.js"

export default (async (language = defaultLanguage, oldLocalization = null) => {
    logger.log("Starting...")

    const content = { language }
    
    await getLocalizationData(content)
    if (oldLocalization) await compareNewDataWithOld(content)

    logger.log("Finished!")

    return content
})