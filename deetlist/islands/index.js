import getPageDOMDocument from "../../../utils/dom-document.js"
import { parseIslandName } from "../../../utils/island-name.js"
import {
    dragonElementsNames,
    baseUrl,
    logger
} from "../settings.js"

async function getIslandsData(content) {
    logger.log("Requesting page and parsing data from islands...")

    content.islands = {}

    await getHeroicRaceData()
    await getMazeIslandData()
    await getGridIslandData()
    await getFogIslandData()
    await getTowerIslandData()
    await getPuzzleIslandData()
    await getRunnerIslandData()

    async function getHeroicRaceData() {
        logger.log("Requesting page and parsing data from Heroic Race...")

        const url = `${baseUrl}/events/race/`
        const document = await getPageDOMDocument(logger, url)

        const $islandDurationTitle = document.querySelector(".dur_text")
        const $islandName = document.querySelector("h1")
        const $dragons = document.querySelectorAll(".over")
        const $laps = document.querySelectorAll(".hl")
        
        const data = {}

        data.duration = getDuration($islandDurationTitle)
        data.name = getName($islandName)
        data.dragons = getDragons($dragons)
        data.laps = getLaps($laps)
        
        content.islands.heroicRace = data
        
        function getDuration($duration) {
            const milissecondsPerSecond = 1000
            const secondsPerMinute = 60
            const milisecondsPerMinute = milissecondsPerSecond * secondsPerMinute
            const minutesPerHour = 60
            const milisecondsPerHour = milisecondsPerMinute * minutesPerHour
            const hoursPerDay = 24
            const milissecondsPerDay = milisecondsPerHour * hoursPerDay

            const islandDuration = Number($duration.textContent.split(" ")[3]) * milissecondsPerDay

            return islandDuration
        }

        function getName($name) {
            const name = parseIslandName($name.textContent)
            return name
        }

        function getDragons($dragons) {
            const dragons = []

            for (const $dragon of $dragons) {
                const dragon = getDragon($dragon)
                dragons.push(dragon)
            } 

            return dragons

            function getDragon($dragon) {
                const $name = $dragon.querySelector(".pan_ic")
                const $rarity = $dragon.querySelector(".img_rar")
                const $elements = $dragon.querySelectorAll(".typ_i")
                const $pageLink = $dragon.querySelector("a")
                const $image = $dragon.querySelector(".pan_img")

                const dragon = {}

                dragon.name = getDragonName($name)
                dragon.rarity = getDragonRarity($rarity)
                dragon.elements = getDragonElements($elements)
                dragon.pageUrl = getDragonPageUrl($pageLink)
                dragon.imageUrl = getDragonImageUrl($image)

                return dragon

                function getDragonName($name) {
                    const name = $name.textContent.trim()
                    return name
                }

                function getDragonRarity($rarity) {
                    const rarityClass = $rarity.classList.value[0]
                    const rarity = rarityClass.replace("img_rp_", "").trim().toUpperCase()
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
                        const elementClass = $element.classList.value[1]
                        const elementKeyName = elementClass.replace("tb_", "")
                        const elementName = dragonElementsNames[elementKeyName]

                        return elementName
                    }
                }

                function getDragonPageUrl($pageLink) {
                    const pageUrl = $pageLink.attributes.href.replace("../../", baseUrl).replace(" ", "%20")
                    return pageUrl
                }

                function getDragonImageUrl($image) {
                    const imageUrl = $image.attributes.src.replace("../../", baseUrl)
                    return imageUrl
                }
            }
        }

        function getLaps($laps) {
            const laps = []

            for (const $lap of $laps) {
                const lap = getLap($lap)
                laps.push(lap)
            }

            return laps

            function getLap($lap) {
                const $firstNodeHeader = $lap.querySelector(".nnh")
                const $nodes = $lap.querySelectorAll(".nn")

                const lapNumber = getLapNumber($firstNodeHeader)
                const lapNodes = getNodes($nodes)

                return {
                    number: lapNumber,
                    nodes: lapNodes
                }

                function getLapNumber($firstNodeHeader) {
                    const textOfBFirstNodeHeader = $firstNodeHeader.textContent
                    const lapNumber = Number(textOfBFirstNodeHeader.split("-")[0].replace("Lap", ""))
                    return lapNumber
                }

                function getNodes($nodes) {
                    const nodes = []

                    for (const $node of $nodes) {
                        const node = getNode($node)
                        nodes.push(node)
                    }

                    return nodes

                    function getNode($node) {
                        const $nodeHeader = $node.querySelector(".nnh")
                        const $nodeMissions = $node.querySelectorAll(".mm")

                        const nodeNumber = getNodeNumber($nodeHeader)
                        const nodeMissions = getMissions($nodeMissions)
                        
                        return {
                            number: nodeNumber,
                            missions: nodeMissions
                        }

                         function getNodeNumber($nodeHeader) {
                            const textOfNodeHeader = $nodeHeader.textContent
                            const nodeNumber = Number(textOfNodeHeader.split("-")[1].replace("Node", ""))
                            return nodeNumber
                        }

                        function getMissions($missions) {
                            const missions = []

                            for (const $mission of $missions) {
                                const mission = getMission($mission)
                                missions.push(mission)
                            }

                            return missions

                            function getMission($mission) {
                                const $missionDatas = $mission.querySelectorAll(".m2")

                                const $missionGoalPoints = $missionDatas[0]
                                const $missionPoolSize = $missionDatas[1]
                                const $missionPoolTime = $missionDatas[2]
                                const $missionTotalPoolTime = $missionDatas[4]
                                const $missionItemCollectChance = $missionDatas[3]

                                const missionGoalPoints = getGoalPoints($missionGoalPoints)
                                const missionPoolSize = getPoolSize($missionPoolSize)
                                const missionPoolTime = getPoolTime($missionPoolTime)
                                const missionTotalPoolTime = getPoolTime($missionTotalPoolTime)
                                const missionItemCollectChance = getItemCollectChance($missionItemCollectChance)

                                return {
                                    goalPoints: missionGoalPoints,
                                    pool: {
                                        size: missionPoolSize,
                                        time: {
                                            one: missionPoolTime,
                                            all: missionTotalPoolTime
                                        }
                                    },
                                    itemCollectChance: missionItemCollectChance
                                }
                                
                                function getGoalPoints($missionGoalPoints) {
                                    const missionGoalPoints = Number($missionGoalPoints.textContent)
                                    return missionGoalPoints
                                }

                                function getPoolSize($missionPoolSize) {
                                    const missionPoolSize = Number($missionPoolSize.textContent)
                                    return missionPoolSize
                                }

                                function getPoolTime($missionPoolTime) {
                                    const rawPoolTime = $missionPoolTime.textContent

                                    if (rawPoolTime === "Instant" || rawPoolTime === "No Minimum") return 0

                                    return 1
                                }

                                function getItemCollectChance($missionItemCollectChance) {
                                    const itemCollectChance = Number($missionItemCollectChance.textContent.replace("%", "")) / 100
                                    return itemCollectChance
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    async function getMazeIslandData() {
        logger.log("Requesting page and parsing data from Maze Island...")

        const url = `${baseUrl}/events/maze/`
        const document = await getPageDOMDocument(logger, url)

        const $islandDurationTitle = document.querySelector(".dur_text")
        const $islandName = document.querySelector("h1")
        const $paths = document.querySelectorAll(".ee")

        const data = {}

        data.duration = getDuration($islandDurationTitle)
        data.name = getName($islandName)
        data.paths = getPaths($paths)

        content.islands.mazeIsland = data

        function getDuration($duration) {
            const milissecondsPerSecond = 1000
            const secondsPerMinute = 60
            const milisecondsPerMinute = milissecondsPerSecond * secondsPerMinute
            const minutesPerHour = 60
            const milisecondsPerHour = milisecondsPerMinute * minutesPerHour
            const hoursPerDay = 24
            const milissecondsPerDay = milisecondsPerHour * hoursPerDay

            const islandDuration = Number($duration.textContent.split(" ")[3]) * milissecondsPerDay

            return islandDuration
        }

        function getName($name) {
            const name = parseIslandName($name.textContent.replace("Guide", ""))
            return name
        }

        function getPaths($paths) {
            const paths = []

            for (const $path of $paths) {
                const path = getPath($path)
                paths.push(path)
            }

            return paths

            function getPath($path) {
                const $pathDragon = $path.querySelector(".ev_ds")
                const $dragonName = $path.querySelector("h3")
                const $pathNodes = $path.querySelectorAll(".miihold")
                const $pathNodesCost = [ null, ...$path.querySelectorAll(".mii_step") ]

                const pathDragon = getDragon($pathDragon, $dragonName)
                const pathTotalCost = getTotalCost($pathDragon)
                const pathNodes = getNodes($pathNodes, $pathNodesCost)

                return {
                    dragon: pathDragon,
                    totalCost: pathTotalCost,
                    nodes: pathNodes
                }

                function getDragon($dragon, $dragonName) {
                    const $dragonCategory = $dragon.querySelector("p")
                    const $dragonRarity = $dragon.querySelector(".img_rar")
                    const $dragonElements = $dragon.querySelectorAll(".typ_i")
                    const $dragonImage = $dragon.querySelector(".mi_i_hld")
                    const $dragonPageLink = $dragon.querySelector("a")

                    const dragonName = getDragonName($dragonName)
                    const dragonCategory = getDragonCategory($dragonCategory)
                    const dragonRarity = getDragonRarity($dragonRarity)
                    const dragonElements = getDragonElements($dragonElements)
                    const dragonImageUrl = getDragonImageUrl($dragonImage)
                    const dragonPageUrl = getDragonPageUrl($dragonPageLink)

                    return {
                        name: dragonName,
                        category: dragonCategory,
                        rarity: dragonRarity,
                        elements: dragonElements,
                        imageUrl: dragonImageUrl,
                        pageUrl: dragonPageUrl
                    }

                    function getDragonName($name) {
                        const dragonName = $name.textContent.trim()
                        return dragonName
                    }

                    function getDragonCategory($category) {
                        const dragonCategory = Number($category.textContent.split(":")[1])
                        return dragonCategory
                    }

                    function getDragonRarity($rarity) {
                        const dragonRarityClass = $rarity.classList.value
                        const dragonRarity = dragonRarityClass[0].replace("img_rp_", "").toUpperCase()
                        return dragonRarity
                    } 

                    function getDragonElements($elements) {
                        const elements = []

                        for (const $element of $elements) {
                            const element = getDragonElement($element)
                            elements.push(element)
                        }

                        return elements

                        function getDragonElement($element) {
                            const elementClass = $element.classList.value[1]
                            const elementKeyName = elementClass.replace("tb_", "")
                            const elementName = dragonElementsNames[elementKeyName]

                            return elementName
                        }
                    }

                    function getDragonImageUrl($image) {
                        const imageUrl = $image.attributes.src.replace("../../", baseUrl)
                        return imageUrl
                    }

                    function getDragonPageUrl($pageLink) {
                        const pageUrl = $pageLink.attributes.href.replace("../../", baseUrl)
                        return pageUrl
                    }
                }

                function getTotalCost($dragon) {
                    const totalCost = Number($dragon.textContent.split(":")[2].split(" ")[1])
                    return totalCost
                }

                function getNodes($nodes, $costs) {
                    const nodes = []

                    for (let nodeIndex = 0; nodeIndex < $nodes.length; nodeIndex++) {
                        const node = getNode($nodes[nodeIndex], $costs[nodeIndex])
                        nodes.push(node)
                    }

                    return nodes

                    function getNode($node, $nodeCost) {
                        const $nodeNumber = $node.querySelector(".nummi")
                        const $nodeTitle = $node.querySelector(".mi_con")
                        const $nodeAccumuledCost = $node.querySelector(".mii_tota b")

                        const nodeNumber = getNodeNumber($nodeNumber)
                        const nodeTitle = getNodeTitle($nodeTitle)
                        const nodeCost = getNodeCost($nodeCost)
                        const nodeAccumuledCost = getNodeAccumuledCost($nodeAccumuledCost)

                        return {
                            number: nodeNumber,
                            title: nodeTitle,
                            const: {
                                current: nodeCost,
                                accumuled: nodeAccumuledCost
                            }
                        }

                        function getNodeNumber($nodeNumber) {
                            const nodeNumber = Number($nodeNumber.textContent)
                            return nodeNumber
                        }

                        function getNodeTitle($nodeTitle) {
                            const nodeTitle = $nodeTitle.textContent
                            return nodeTitle
                        }

                        function getNodeCost($nodeCost) {
                            if ($nodeCost) {
                                const nodeCost = Number($nodeCost.textContent.trim().substr(1))
                                return nodeCost  
                            }
                            
                            return 0
                        }

                        function getNodeAccumuledCost($nodeAccumuledCost) {
                           const nodeAccumuledCost = Number($nodeAccumuledCost.textContent)
                           return nodeAccumuledCost
                        }
                    }
                }
            }
        }
    }

    async function getGridIslandData() {
        console.log("> [deetlist-robot] Requesting page and parsing data from Grid Island")

        const url = `${baseUrl}/events/grid/`
        const document = await getPageDOMDocument(logger, url)

        const $isalndName = document.querySelector("h1")
        const $islandDurationTitle = document.querySelector(".dur_text")
        const $dragons = document.querySelectorAll(".over")

        const data = {}

        data.duration = getDuration($islandDurationTitle)
        data.name = getName($isalndName)
        data.dragons = getDragons($dragons)

        content.islands.gridIsland = data

        function getDuration($duration) {
            const milissecondsPerSecond = 1000
            const secondsPerMinute = 60
            const milisecondsPerMinute = milissecondsPerSecond * secondsPerMinute
            const minutesPerHour = 60
            const milisecondsPerHour = milisecondsPerMinute * minutesPerHour
            const hoursPerDay = 24
            const milissecondsPerDay = milisecondsPerHour * hoursPerDay

            const islandDuration = Number($duration.textContent.split(" ")[3]) * milissecondsPerDay

            return islandDuration
        }

        function getName($name) {
            const name = $name.textContent.trim().toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
            return name
        }

        function getDragons($dragons) {
            const dragons = []

            for (const $dragon of $dragons) {
                const dragon = getDragon($dragon)
                dragons.push(dragon)
            } 

            return dragons

            async function getDragon($dragon) {
                const $name = $dragon.querySelector(".pan_ic")
                const $rarity = $dragon.querySelector(".img_rar")
                const $elements = $dragon.querySelectorAll(".typ_i")
                const $pageLink = $dragon.querySelector("a")
                const $image = $dragon.querySelector(".pan_img")

                const dragon = {}

                dragon.name = getDragonName($name)
                dragon.rarity = getDragonRarity($rarity)
                dragon.elements = getDragonElements($elements)
                dragon.pageUrl = getDragonPageUrl($pageLink)
                dragon.imageUrl = getDragonImageUrl($image)

                return dragon

                function getDragonName($name) {
                    const name = $name.textContent.trim()
                    return name
                }

                function getDragonRarity($rarity) {
                    const rarityClass = $rarity.classList.value[0]
                    const rarity = rarityClass.replace("img_rp_", "").trim().toUpperCase()
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
                        const elementClass = $element.classList.value[1]
                        const elementKeyName = elementClass.replace("tb_", "")
                        const elementName = dragonElementsNames[elementKeyName]

                        return elementName
                    }
                }

                function getDragonPageUrl($pageLink) {
                    const pageUrl = $pageLink.attributes.href.replace("../../", baseUrl)
                    return pageUrl
                }

                function getDragonImageUrl($image) {
                    const imageUrl = $image.attributes.src.replace("../../", baseUrl)
                    return imageUrl
                }
            }
        }
    }

    async function getFogIslandData() {
        console.log("> [deetlist-robot] Requesting page and parsing data from Fog Island")

        const url = `${baseUrl}/events/fog/`
        const document = await getPageDOMDocument(logger, url)

        const $isalndName = document.querySelector("h1")
        const $islandDurationTitle = document.querySelector(".dur_text")
        const $dragons = document.querySelectorAll(".over")

        const data = {}

        data.duration = await getDuration($islandDurationTitle)
        data.name = await getName($isalndName)
        data.dragons = await getDragons($dragons)

        content.islands.fogIsland = data

        function getDuration($duration) {
            const milissecondsPerSecond = 1000
            const secondsPerMinute = 60
            const milisecondsPerMinute = milissecondsPerSecond * secondsPerMinute
            const minutesPerHour = 60
            const milisecondsPerHour = milisecondsPerMinute * minutesPerHour
            const hoursPerDay = 24
            const milissecondsPerDay = milisecondsPerHour * hoursPerDay

            const islandDuration = Number($duration.textContent.split(" ")[3]) * milissecondsPerDay

            return islandDuration
        }

        function getName($name) {
            const name = parseIslandName($name.textContent)
            return name
        }

        function getDragons($dragons) {
            const dragons = []

            for (const $dragon of $dragons) {
                const dragon = getDragon($dragon)
                dragons.push(dragon)
            } 

            return dragons

            function getDragon($dragon) {
                const $name = $dragon.querySelector(".pan_ic")
                const $rarity = $dragon.querySelector(".img_rar")
                const $elements = $dragon.querySelectorAll(".typ_i")
                const $pageLink = $dragon.querySelector("a")
                const $image = $dragon.querySelector(".pan_img")

                const dragon = {}

                dragon.name = getDragonName($name)
                dragon.rarity = getDragonRarity($rarity)
                dragon.elements = getDragonElements($elements)
                dragon.pageUrl = getDragonPageUrl($pageLink)
                dragon.imageUrl = getDragonImageUrl($image)

                return dragon

                function getDragonName($name) {
                    const name = $name.textContent.trim()
                    return name
                }

                function getDragonRarity($rarity) {
                    const rarityClass = $rarity.classList.value[0]
                    const rarity = rarityClass.replace("img_rp_", "").trim().toUpperCase()
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
                        const elementClass = $element.classList.value[1]
                        const elementKeyName = elementClass.replace("tb_", "")
                        const elementName = dragonElementsNames[elementKeyName]

                        return elementName
                    }
                }

                function getDragonPageUrl($pageLink) {
                    const pageUrl = $pageLink.attributes.href.replace("../../", baseUrl)
                    return pageUrl
                }

                function getDragonImageUrl($image) {
                    const imageUrl = $image.attributes.src.replace("../../", baseUrl)
                    return imageUrl
                }
            }
        }
    }

    async function getTowerIslandData() {
        console.log("> [deetlist-robot] Requesting page and parsing data from Tower Island")

        const url = `${baseUrl}/events/tower/`
        const document = await getPageDOMDocument(logger, url)

        const $isalndName = document.querySelector("h1")
        const $islandDurationTitle = document.querySelector(".dur_text")
        const $dragons = document.querySelectorAll(".over")

        const data = {}

        data.duration = getDuration($islandDurationTitle)
        data.name = getName($isalndName)
        data.dragons = getDragons($dragons)

        content.islands.towerIsland = data

        function getDuration($duration) {
            const milissecondsPerSecond = 1000
            const secondsPerMinute = 60
            const milisecondsPerMinute = milissecondsPerSecond * secondsPerMinute
            const minutesPerHour = 60
            const milisecondsPerHour = milisecondsPerMinute * minutesPerHour
            const hoursPerDay = 24
            const milissecondsPerDay = milisecondsPerHour * hoursPerDay

            const islandDuration = Number($duration.textContent.split(" ")[3]) * milissecondsPerDay

            return islandDuration
        }

        function getName($name) {
            const name = $name.textContent.trim().toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
            return name
        }

        function getDragons($dragons) {
            const dragons = []

            for (const $dragon of $dragons) {
                const dragon = getDragon($dragon)
                dragons.push(dragon)
            } 

            return dragons

            function getDragon($dragon) {
                const $name = $dragon.querySelector(".pan_ic")
                const $rarity = $dragon.querySelector(".img_rar")
                const $elements = $dragon.querySelectorAll(".typ_i")
                const $pageLink = $dragon.querySelector("a")
                const $image = $dragon.querySelector(".pan_img")

                const dragon = {}

                dragon.name = getDragonName($name)
                dragon.rarity = getDragonRarity($rarity)
                dragon.elements = getDragonElements($elements)
                dragon.pageUrl = getDragonPageUrl($pageLink)
                dragon.imageUrl = getDragonImageUrl($image)

                return dragon

                function getDragonName($name) {
                    const name = $name.textContent.trim()
                    return name
                }

                function getDragonRarity($rarity) {
                    const rarityClass = $rarity.classList.value[0]
                    const rarity = rarityClass.replace("img_rp_", "").trim().toUpperCase()
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
                        const elementClass = $element.classList.value[1]
                        const elementKeyName = elementClass.replace("tb_", "")
                        const elementName = dragonElementsNames[elementKeyName]

                        return elementName
                    }
                }

                function getDragonPageUrl($pageLink) {
                    const pageUrl = $pageLink.attributes.href.replace("../../", baseUrl)
                    return pageUrl
                }

                function getDragonImageUrl($image) {
                    const imageUrl = $image.attributes.src.replace("../../", baseUrl)
                    return imageUrl
                }
            }
        }
    }

    async function getPuzzleIslandData() {
        console.log("> [deetlist-robot] Requesting page and parsing data from Puzzle Island")

        const url = `${baseUrl}/events/puzzle/`
        const document = await getPageDOMDocument(logger, url)

        const $isalndName = document.querySelector("h1")
        const $islandDurationTitle = document.querySelector(".dur_text")
        const $dragons = document.querySelectorAll(".over")

        const data = {}

        data.duration = getDuration($islandDurationTitle)
        data.name = getName($isalndName)
        data.dragons = getDragons($dragons)

        content.islands.puzzleIsland = data

        function getDuration($duration) {
            const milissecondsPerSecond = 1000
            const secondsPerMinute = 60
            const milisecondsPerMinute = milissecondsPerSecond * secondsPerMinute
            const minutesPerHour = 60
            const milisecondsPerHour = milisecondsPerMinute * minutesPerHour
            const hoursPerDay = 24
            const milissecondsPerDay = milisecondsPerHour * hoursPerDay

            const islandDuration = Number($duration.textContent.split(" ")[3]) * milissecondsPerDay

            return islandDuration
        }

        function getName($name) {
            const name = parseIslandName($name.textContent)
            return name
        }

        function getDragons($dragons) {
            const dragons = []

            for (const $dragon of $dragons) {
                const dragon = getDragon($dragon)
                dragons.push(dragon)
            } 

            return dragons

            function getDragon($dragon) {
                const $name = $dragon.querySelector(".pan_ic")
                const $rarity = $dragon.querySelector(".img_rar")
                const $elements = $dragon.querySelectorAll(".typ_i")
                const $pageLink = $dragon.querySelector("a")
                const $image = $dragon.querySelector(".pan_img")

                const dragon = {}

                dragon.name = getDragonName($name)
                dragon.rarity = getDragonRarity($rarity)
                dragon.elements = getDragonElements($elements)
                dragon.pageUrl = getDragonPageUrl($pageLink)
                dragon.imageUrl = getDragonImageUrl($image)

                return dragon

                function getDragonName($name) {
                    const name = $name.textContent.trim()
                    return name
                }

                function getDragonRarity($rarity) {
                    const rarityClass = $rarity.classList.value[0]
                    const rarity = rarityClass.replace("img_rp_", "").trim().toUpperCase()
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
                        const elementClass = $element.classList.value[1]
                        const elementKeyName = elementClass.replace("tb_", "")
                        const elementName = dragonElementsNames[elementKeyName]

                        return elementName
                    }
                }

                function getDragonPageUrl($pageLink) {
                    const pageUrl = $pageLink.attributes.href.replace("../../", baseUrl)
                    return pageUrl
                }

                function getDragonImageUrl($image) {
                    const imageUrl = $image.attributes.src.replace("../../", baseUrl)
                    return imageUrl
                }
            }
        }

        async function getMissions($missions) {
            async function getMission($mission) {}
        }
    }

    async function getRunnerIslandData() {
        console.log("> [deetlist-robot] Requesting page and parsing data from Runner Island")

        const url = `${baseUrl}/events/puzzle/`
        const document = await getPageDOMDocument(logger, url)

        const $isalndName = document.querySelector("h1")
        const $islandDurationTitle = document.querySelector(".dur_text")
        const $dragons = document.querySelectorAll(".over")

        const data = {}

        data.duration = getDuration($islandDurationTitle)
        data.name = getName($isalndName)
        data.dragons = getDragons($dragons)

        content.islands.runnerIsland = data

        function getDuration($duration) {
            const milissecondsPerSecond = 1000
            const secondsPerMinute = 60
            const milisecondsPerMinute = milissecondsPerSecond * secondsPerMinute
            const minutesPerHour = 60
            const milisecondsPerHour = milisecondsPerMinute * minutesPerHour
            const hoursPerDay = 24
            const milissecondsPerDay = milisecondsPerHour * hoursPerDay

            const islandDuration = Number($duration.textContent.split(" ")[3]) * milissecondsPerDay

            return islandDuration
        }

        function getName($name) {
            const name = $name.textContent.trim().toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())
            return name
        }

        function getDragons($dragons) {
            const dragons = []

            for (const $dragon of $dragons) {
                const dragon = getDragon($dragon)
                dragons.push(dragon)
            } 

            return dragons

            function getDragon($dragon) {
                const $name = $dragon.querySelector(".pan_ic")
                const $rarity = $dragon.querySelector(".img_rar")
                const $elements = $dragon.querySelectorAll(".typ_i")
                const $pageLink = $dragon.querySelector("a")
                const $image = $dragon.querySelector(".pan_img")

                const dragon = {}

                dragon.name = getDragonName($name)
                dragon.rarity = getDragonRarity($rarity)
                dragon.elements = getDragonElements($elements)
                dragon.pageUrl = getDragonPageUrl($pageLink)
                dragon.imageUrl = getDragonImageUrl($image)

                return dragon

                function getDragonName($name) {
                    const name = $name.textContent.trim()
                    return name
                }

                function getDragonRarity($rarity) {
                    const rarityClass = $rarity.classList.value[0]
                    const rarity = rarityClass.replace("img_rp_", "").trim().toUpperCase()
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
                        const elementClass = $element.classList.value[1]
                        const elementKeyName = elementClass.replace("tb_", "")
                        const elementName = dragonElementsNames[elementKeyName]

                        return elementName
                    }
                }

                function getDragonPageUrl($pageLink) {
                    const pageUrl = $pageLink.attributes.href.replace("../../", baseUrl)
                    return pageUrl
                }

                function getDragonImageUrl($image) {
                    const imageUrl = $image.attributes.src.replace("../../", baseUrl)
                    return imageUrl
                }
            }
        }
    }
}

export default getIslandsData