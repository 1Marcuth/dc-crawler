import { baseUrl, logger } from "./settings.js"
import { getDecryptedData } from "./utils.js"

async function getDragonTVData(content, month = null) {
    logger.log(`Requesting data from Dragon TV`)

    if (!month) {
        const currentMonth = new Date().getMonth() + 1
        month = currentMonth
    }

    const url = `${baseUrl}/DragonTv/Get`
    const options = { params: { month } }
    const dragonTVData = await getDecryptedData(url, options)

    content.dragonTV = dragonTVData
}

export default getDragonTVData