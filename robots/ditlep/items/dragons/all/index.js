import { baseUrl, logger } from "../../../settings.js"
import getDragonPagesData from "./pages.js"

async function getDragonsData(content) {
    logger.log(`Requesting data from all dragons..`)

    const dragonPageUrl = `${baseUrl}/Dragon/Search`
    const dragonsPerPage = 20
    const options = {
        params: {
            dragonName: "",
            rarities: [],
            elements: "",
            page: 0,
            pageSize: dragonsPerPage,
            category: "",
            inStore: null,
            breedable: null,
            tag: ""
        }
    }

    content.dragons = await getDragonPagesData(
        dragonPageUrl,
        dragonsPerPage,
        options
    )
}

export default getDragonsData