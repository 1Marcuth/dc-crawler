import { getPageData } from "../../utils/requests.js"
import { logger } from "./settings.js"

async function getLocalizationData(content) {
    content.data = await getData()
    content.dataObject = joinArrayItemsInANewObject(content.data)

    function joinArrayItemsInANewObject(arrayItems) {
        console.log("> [localization-robot] Converting object array in a new object")

        const localizationObject = {}

        for (const item of arrayItems) {
            for (const key of Object.keys(item)) {
                if (!Object.keys(localizationObject).includes(key)) {
                    localizationObject[key] = item[key]
                } else {
                    throw new Error("> [localization-robot-error] Duplicate key in localization")
                }
            }
        }
        
        return localizationObject
    }

    async function getData() {
        const url = `https://sp-translations.socialpointgames.com/deploy/dc/android/prod/dc_android_${content.language}_prod_wetd46pWuR8J5CmS.json`
        
        logger.log(`Fetching data from the url: ${url}`)

        const data = await getPageData(url)

        return data
    }
}

export default getLocalizationData