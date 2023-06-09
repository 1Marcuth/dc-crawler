import axios from "axios"

async function getPageData(pageUrl, options) {
    const response = await axios.get(pageUrl, options)
    return response.data
}

export { getPageData }