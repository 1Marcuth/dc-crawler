import { getDecryptedData } from "../../../utils.js"

async function getDragonPagesData(dragonPageUrl, dragonsPerPage, options) {
    const totalOfPages = await getTotalPages(dragonsPerPage)

    const dragonsData = []

    for (let pageNumber = 0; pageNumber <= totalOfPages; pageNumber++) {
        const pageDragonsData = await getDragonPageData(pageNumber)

        dragonsData.push(...pageDragonsData.items)
    }

    async function getTotalPages(dragonsPerPage) {
        const firstPageData = await getDragonPageData(0)
        const totalOfDragons = firstPageData.total
        const totalOfPages = Math.ceil(totalOfDragons / dragonsPerPage)

        return totalOfPages
    }

    async function getDragonPageData(pageNumber) {
        options.params.page = pageNumber

        const pageDragonsData = await getDecryptedData(dragonPageUrl, options)

        return pageDragonsData
    }

    return dragonsData
}

export default getDragonPagesData