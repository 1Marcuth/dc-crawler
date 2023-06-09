import { baseUrl, logger } from "./settings.js"
import { getDecryptedData } from "./utils.js"

async function getAllianceChestsData(content, month = null) {
    logger.log(`Requesting data from Alliance chests`)

    if (!month) {
        const currentMonth = new Date().getMonth() + 1
        month = currentMonth
    }

    const url = `${baseUrl}/AllianceChest/Get?month=${month}`
    const allianceChestsData = await getDecryptedData(url)

    content.allianceChests = allianceChestsData
}

export default getAllianceChestsData