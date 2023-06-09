import getDragonsById from "../items/dragons/get-by-id.js"
import { baseUrl, logger } from "../settings.js"
import { getDecryptedData } from "../utils.js"

async function getIslandsData(content) {
    logger.log("Geting data from islands...")

    content.islands = {}

    await getHeroicRaceData()
    await getMazeIslandData()
    await getGridIslandData()
    await getFogIslandData()
    await getTowerIslandData()
    await getPuzzleIslandData()
    await getRunnerIslandData()
    
    async function getHeroicRaceData() {
        logger.log("geting data from Heroic Race")

        const data = await getMainData() 
        data.lapRewards = await getLapRewardsData()

        content.islands.heroicRace = data

        async function getMainData() {
            const url = `${baseUrl}/HeroicRace/Get`
            const mainData = await getDecryptedData(url)
            return mainData
        }

        async function getLapRewardsData() {
            const url = `${baseUrl}/HeroicRace/GetLapRewards`
            const lapRewardsData = await getDecryptedData(url)
            return lapRewardsData
        }
    }

    async function getMazeIslandData() {
        logger.log(`geting data from Maze Island`)

        const url = `${baseUrl}/MazeIsland/Get/`
        const data = await getDecryptedData(url)

        const islandDragonsId = []

        for (const path of data.config.paths) {
            islandDragonsId.push(path.dragon_type)
        }

        data.dragons = await getDragonsById(islandDragonsId)
        content.islands.mazeIsland = data
    }

    async function getGridIslandData() {
        logger.log(`Geting data from Grid Island`)
        const url = `${baseUrl}/GridIsland/Get`
        const data = await getDecryptedData(url)
        content.islands.gridIsland = data
    }

    async function getFogIslandData() {
        logger.log(`Geting data from Fog Island`)
        const url = `${baseUrl}/FogIsland/Get`
        const options = { params: { "latest": true,"routeId": 0 } }
        const data = await getDecryptedData(url, options)
        content.islands.fogIsland = data
    }

    async function getTowerIslandData() {
        logger.log(`Geting data from Tower Island`)
        const url = `${baseUrl}/TowerIsland/Get`
        const data = await getDecryptedData(url)
        content.islands.towerIsland = data
    }

    async function getPuzzleIslandData() {
        logger.log(`Geting data from Puzzle Island`)
        const url = `${baseUrl}/PuzzleIsland/Get`
        const data = await getDecryptedData(url)
        content.islands.puzzleIsland = data
    }

    async function getRunnerIslandData() {
        logger.log(`Geting data from Runner Island`)
        const url = `${baseUrl}/PuzzleIsland/Get`
        const data = await getDecryptedData(url)
        content.islands.runnerIsland = data
    }
}

export default getIslandsData