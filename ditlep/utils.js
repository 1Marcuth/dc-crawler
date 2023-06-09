import CryptoJS from "crypto-js"

import { getPageData } from "../../utils/requests.js"
import { logger } from "./settings.js"

async function getDecryptedData(pageUrl, options = {}) {
    options.headers = { "Accept-Encoding": "gzip,deflate,compress" }
    const encryptedData = await getPageData(pageUrl, options)
    const decryptedData = decryptData(encryptedData)

    return decryptedData

    function decryptData(encryptedData) {
        try {
            const iv = CryptoJS.enc.Hex.parse("e84ad660c4721ae0e84ad660c4721ae0")
            const password = CryptoJS.enc.Utf8.parse("ZGl0bGVwLWRyYWdvbi1jaXR5")
            const salt = CryptoJS.enc.Utf8.parse("ZGl0bGVwLWRyYWdvbi1jaXR5LXNhbHQ=")
            const key = CryptoJS.PBKDF2(password.toString(CryptoJS.enc.Utf8), salt, {
                keySize: 4,
                iterations: 1e3
            })
            const cipher = CryptoJS.lib.CipherParams.create({
                ciphertext: CryptoJS.enc.Base64.parse(encryptedData)
            })
            const decryptedData = CryptoJS.AES.decrypt(cipher, key, {
                mode: CryptoJS.mode.CBC,
                iv: iv,
                padding: CryptoJS.pad.Pkcs7
            })
    
            return JSON.parse(decryptedData.toString(CryptoJS.enc.Utf8))

        } catch (error) {
            logger.error(error.message)
            throw new Error("> [ditlep-robot-error] Failed when trying to decrypt data")
        }
    }
}

export { getDecryptedData }