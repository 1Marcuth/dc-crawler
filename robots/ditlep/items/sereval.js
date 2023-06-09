import { baseUrl } from "../settings.js"

async function getItemsData(content) {
    const itemsPageUrl = `${baseUrl}/Items/ItemFilter`
    const itemsPerPage = 20
    const itemsRequestParams = {
        "sort": "",
        "group": "",
        "page": 1,
        "pageSize": 20,
        "filter": "TypeId~eq~''~or~Name~contains~''~or~BuildingTime~contains~''~or~Price~contains~''~or~Sell~contains~''~or~InStore~contains~''"
    }

    content.items = await getItemPagesData()

    async function getItemPagesData() {
        const totalOfPages = await getTotalPages(itemsPerPage)

        const itemsData = []

        for (let pageNumber = 1; pageNumber <= totalOfPages; pageNumber++) {
            const pageItemsData = await getItemPage(pageNumber)

            itemsData.push(...pageItemsData.Data)
        }

        return itemsData

        async function getTotalPages(itemsPerPage) {
            const firstPageData = await getItemPage(1)
            const totalOfItems = firstPageData.Total
            const totalOfPages = Math.ceil(totalOfItems / itemsPerPage)
            return totalOfPages
        }

        async function getItemPage(pageNumber) {

        }
    }
}

export default getItemsData