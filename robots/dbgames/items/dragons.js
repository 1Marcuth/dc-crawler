import getPageDocument from "../../../utils/dom-document.js"
import { logger, baseUrl } from "../settings.js"

async function getDragonPagesData(content) {
    logger.log("Requesting page and parsing data from All dragons...")

    const url = `${baseUrl}/dragons`
    const requestOptions = {
        params: { rarity: "common,rare,very rare,epic,legendary,heroic" },
        headers: { "Accept-Encoding": "gzip,deflate,compress" }
    }

    const totalOfPages = await getTotalOfPages()
    
    const data = []

    for (let pageNumber = 1; pageNumber <= totalOfPages; pageNumber++) {
        const newDragons = await getDragonPageData(pageNumber)
        data.push(...newDragons)
    }

    content.dragons = data

    async function getTotalOfPages() {
        requestOptions.params.p = 1
        const document = await getPageDocument(logger, url, requestOptions)
        const $lastPageLink = document.querySelector(".prwr-hrz+ .listlink a:nth-child(17)")
        const totalOfPages = getPageNumber($lastPageLink)

        return totalOfPages

        function getPageNumber($pageLink) {
            const pageNumber = Number($pageLink.attributes.href.split("p=")[1])
            return pageNumber
        }
    }       

    async function getDragonPageData(pageNumber) {
        requestOptions.params.p = pageNumber

        const document = await getPageDocument(logger, url, requestOptions)
        const $dragons = document.querySelectorAll(".result-data")

        const dragons = []

        for (const $dragon of $dragons) {
            const dragon = getDragon($dragon)
            dragons.push(dragon)
        }

        return dragons

        function getDragon($dragon) {
            const $dragonHeader = $dragon.querySelector(".subtitle:first-child")
            const $dragonName = $dragonHeader.querySelector("a")
            const $dragonDescription = $dragon.querySelector(".col-sm-12.rhs.text-data")
            const $dragonRarity = $dragon.querySelector(".rarity .iconized-text")
            const $dragonElements = $dragon.querySelectorAll(".element")
            const $dragonBreedingTime = $dragon.querySelector("tr:nth-child(3) .iconized-text")
            const $dragonHatchingTime = $dragon.querySelector("tr:nth-child(4) .iconized-text")
            const $dragonGoldProductionIncome = $dragon.querySelector("tr:nth-child(5) .iconized-text")
            const $dragonFirstImage = $dragon.querySelector(".col-xs-4:nth-child(1) .entityimg")
            const $dragonXpOnHatching = $dragon.querySelector("tr:nth-child(6) .iconized-text")

            const dragon = {}

            dragon.id = getDragonId($dragonHeader)
            dragon.name = getDragonName($dragonName)
            dragon.description = getDragonDescription($dragonDescription)
            dragon.rarity = getDragonRarity($dragonRarity)
            dragon.elements = getDragonElements($dragonElements)
            dragon.breedingTime = getDragonBreedingTime($dragonBreedingTime)
            dragon.hatchingTime = getDragonHatchingTime($dragonHatchingTime)
            dragon.goldProductionIncome = getDragonGoldProductionIncome($dragonGoldProductionIncome)
            dragon.xpOnHatching = getDragonXpOnHatching($dragonXpOnHatching)
            dragon.imgName = getDragonImageName($dragonFirstImage)
            dragon.pageUrl = getDragonPageUrl($dragonName)

            return dragon

            function getDragonId($dragonHeader) {
                const id = Number($dragonHeader.textContent.split("[")[1].replace("]", ""))
                return id
            }

            function getDragonName($dragonName) {
                const name = $dragonName.textContent
                return name
            }

            function getDragonDescription($dragonDescription) {
                const description = $dragonDescription.textContent.trim()
                return description
            }

            function getDragonRarity($dragonRarity) {
                const rarity = $dragonRarity.textContent.substr(0, 1)
                return rarity
            }

            function getDragonElements($elements) {
                const elements = []

                for (const $element of $elements) {
                    const element = getDragonElement($element)
                    elements.push(element)
                }

                return elements

                function getDragonElement($element) {
                    const element = $element.textContent.toLowerCase()
                    return element
                }
            }

            function parseStringTimeToMilliseconds(stringTime) {
                const milissecondsPerSecond = 1000
                const secondsPerMinute = 60
                const milisecondsPerMinute = milissecondsPerSecond * secondsPerMinute
                const minutesPerHour = 60
                const milisecondsPerHour = milisecondsPerMinute * minutesPerHour

                const [ hours, minutes, seconds ] = stringTime.split(":").map(Number)
                const totalMilliseconds = (hours * milisecondsPerHour) + (minutes * milisecondsPerMinute) + (seconds * milissecondsPerSecond)
                
                return totalMilliseconds
            }

            function getDragonBreedingTime($dragonBreedingTime) {
                const breedingTime = parseStringTimeToMilliseconds($dragonBreedingTime.textContent)
                return breedingTime
            }

            function getDragonHatchingTime($dragonHatchingTime) {
                const hatchingTime = parseStringTimeToMilliseconds($dragonHatchingTime.textContent)
                return hatchingTime
            }

            function getDragonGoldProductionIncome($dragonGoldProductionIncome) {
                if (!$dragonGoldProductionIncome) return null

                const goldProductionIncome = Number($dragonGoldProductionIncome.textContent.split(" ")[0])
                return goldProductionIncome
            }

            function getDragonXpOnHatching($dragonXpOnHatching) {
                if (!$dragonXpOnHatching) return null

                const xpOnHatching = Number($dragonXpOnHatching.textContent.replace(/,/g, ""))
                return xpOnHatching
            }

            function getDragonImageName($firstImage) {
                if (!$firstImage) return null

                const imageName = $firstImage.attributes.src
                    .replace("https://dci-static-s1.socialpointgames.com/static/dragoncity/mobile/ui/dragons/ui_", "")
                    .replace("_3.png", "")
                return imageName
            }

            function getDragonPageUrl($dragonName) {
                const pageUrl = `${baseUrl}/${$dragonName.attributes.href}`
                return pageUrl
            }
        }
    }
}

export default getDragonPagesData