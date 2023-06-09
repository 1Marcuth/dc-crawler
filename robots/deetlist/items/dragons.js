import getPageDocument from "../../../utils/dom-document.js"
import {
    dragonElementsNames,
    baseUrl,
    logger
} from "../settings.js"

async function getDragonsData(content) {
    console.log("> [deetlist-robot] Requesting page and parsing data from all dragons...")

    const url = `${baseUrl}/all-dragons/`
    const document = await getPageDocument(logger, url)
    
    const $dragonsScript = document.querySelector("#q_src ~ script")
    const $dragons = document.querySelectorAll(".drag_link:has(.drag)")

    const dragonsObject = getDragonsObject($dragonsScript)
    const dragons = getDragons($dragons, dragonsObject)

    content.dragons = dragons

    function getDragonsObject($dragonsScript) {
        const dragonsObjectString = $dragonsScript.textContent.split("=")[1].split(";")[0].trim()
        const dragonsJson = JSON.parse(dragonsObjectString)
        return dragonsJson
    }

    function getDragons($dragons, dragonsObject) {
        const dragonsObjectKeys = Object.keys(dragonsObject)
        const dragons = []

        for (let dragonIndex = 0; dragonIndex < $dragons.length; dragonIndex++) {
            const dragonObjectKey = dragonsObjectKeys[dragonIndex]
            const dragonObject = dragonsObject[dragonObjectKey]
            const dragon = getDragon($dragons[dragonIndex], dragonObject, dragonObjectKey)
            dragons.push(dragon)
        }

        return dragons

        function getDragon($dragon, dragonObject, dragonObjectKey) {
            const $dragonName = $dragon.querySelector(".drag")
            const rawDragonElementsInArray = getElementsInArray(dragonObject)

            const dragon = {}

            dragon.name = getDragonName($dragonName, dragonObjectKey)
            dragon.category = getDragonCategory(dragonObject.c)
            dragon.elements = getDragonElements(rawDragonElementsInArray)
            dragon.imageUrl = getDragonImageUrl($dragon)
            dragon.pageUrl = getDragonPageUrl($dragon)

            return dragon

            function getElementsInArray(dragonObject) {
                const dragonElementsLimit = 4
                const dragonObjectKeys = Object.keys(dragonObject)

                const elements = []

                for (let i = 1; i <= dragonElementsLimit; i++) {
                    const key = `t${i}`
                    if (!dragonObjectKeys.includes(key)) break
                    elements.push(dragonObject[key])
                }

                return elements
            }

            function getDragonName($name, nameOfObject) {
                const nameOfHtml = $name.textContent
                let namekeyEquivalent = ""

                for (const word of nameOfHtml.toLowerCase().split(" ")) {
                    if (word !== "dragon") {
                        namekeyEquivalent += word + " "
                    }
                }

                namekeyEquivalent = namekeyEquivalent.trim()

                if (!(namekeyEquivalent === nameOfObject || "dragon " + namekeyEquivalent === nameOfObject)) {
                    console.log(namekeyEquivalent)
                    console.log(nameOfObject)

                    throw new Error("> [deetlist-robot] Dragon name coming from object is different than coming from HTML")
                }

                return nameOfHtml
            }

            function getDragonCategory(categoryOfObject) {
                const category = Number(categoryOfObject)
                return category
            }

            function getDragonElements(elementsOfObject) {
                const elements = []

                for (const elementOfObject of elementsOfObject) {
                    const element = getDragonElement(elementOfObject)
                    elements.push(element)
                }

                return elements

                function getDragonElement(elementOfObject) {
                    const element = dragonElementsNames[elementOfObject]
                    return element
                }
            }

            function getDragonImageUrl($pageLink) {
                const imageUrl = $pageLink.attributes.href.replace("../", `${baseUrl}img/`).toLowerCase().replace(" ", "%20") + ".png"
                return imageUrl
            }

            function getDragonPageUrl($pageLink) {
                const pageUrl = $pageLink.attributes.href
                    .replace("../", baseUrl)
                    .replace(" ", "%20")
                    
                return pageUrl
            }
        }
    } 
}

export default getDragonsData