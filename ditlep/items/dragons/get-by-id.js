import { baseUrl, logger } from "../../settings.js"
import { getDecryptedData } from "../../utils.js"

async function getDragonsById(dragonIds) {
    logger.log(`Fetching data of dragons from ids (${dragonIds.join(", ")})...`)

    const url = `${baseUrl}/Dragon/GetDragonByIds`
    const options = { params: { dragonIds } }
    const dragons = await getDecryptedData(url, options)

    logger.log(`Data fetching of dragons from ids (${dragonIds.join(", ")}) completed successfully!`)

    return dragons
}

export default getDragonsById