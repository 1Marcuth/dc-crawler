import fs from "fs"

import { dataFilePath } from "./settings.js"

async function compareNewDataWithOld(content) {
    console.log("> [localization-robot] Comparing new information with old information...")

    if (!fs.existsSync(dataFilePath)) {
        content.newKeys = []
        content.editedValues = []
        return
    }

    const oldDataString = await fs.promises.readFile(dataFilePath)
    const oldData = JSON.parse(oldDataString)
    const newData = content.data
    
    content.newKeys = scanKeys() 
    content.editedValues = compareValues()

    function scanKeys() {
        console.log("> [localization-robot] Looking for new keys...")

        const newKeys = []

        const newDataKeys = Object.keys(newData)
        const oldDataKeys = Object.keys(oldData)

        for (const key of newDataKeys) {
            if (!oldDataKeys.includes(key)) {
                newKeys.push(key)
            }
        }

        console.log("> [localization-robot] Search completed successfully!")

        return newKeys
    }

    function compareValues() {
        console.log("> [localization-robot] Comparing key values...")

        const editedValues = []

        const oldDataKeys = Object.keys(oldData)

        for (const key of oldDataKeys) {
            if (oldData[key] !== newData[key]) {
                editedValues.push({
                    key: key,
                    oldValue: oldData[key],
                    newValue: newData[key]
                })
            }
        }

        console.log("> [localization-robot] Comparison completed successfully!")
        
        return editedValues
    }
}

export default compareNewDataWithOld