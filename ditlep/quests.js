import { logger, baseUrl } from "./settings.js"
import { getDecryptedData } from "./utils.js"

async function getQuestsData(content) {
    logger.log(`Requesting data from Quests`)
    const url = `${baseUrl}/Tournament/GetAll`
    const questsData = await getDecryptedData(url)
    content.quests = questsData
}

export default getQuestsData