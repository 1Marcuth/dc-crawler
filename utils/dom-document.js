import parseHtml from "node-html-parser"
import queryString from "querystring"

import { getPageData } from "./requests.js"

async function getPageDocument(logger, pageUrl, options = {}) {
    if (options.params) {
        logger.log(`Fetching html page from the url: ${pageUrl}/?${queryString.stringify(options.params)}`)
    } else {
        logger.log(`Fetching html page from the url: ${pageUrl}`)
    }
    
    const response = await getPageData(pageUrl, options)
    const DOMDocument = convertPageTextToDocument(response)

    return DOMDocument

    function convertPageTextToDocument(pageText) {
        const DOMDocument = parseHtml.parse(pageText)
        return DOMDocument
    }
}

export default getPageDocument