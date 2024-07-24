import crypto from 'crypto'

export class EncryptServices {
    static algorithm = 'aes-256-cbc'
    /**
     * @typedef EncryptedPayload
     * @property {String} iv
     * @property {String} salt
     * @property {String} data
     *
     */

    /**
     * @param {Buffer} dataBuffer
     * @returns EncryptedPayload
     */
    static encrypt(dataBuffer) {
        if (!Buffer.isBuffer(dataBuffer)) {
            dataBuffer = Buffer.from(dataBuffer)
        }
        const iv = crypto.randomBytes(16)
        const salt = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv(
            EncryptServices.algorithm,
            crypto.scryptSync(process.env.APP_SECRET, salt, 32),
            iv,
        )
        const encrypted = Buffer.concat([
            cipher.update(dataBuffer),
            cipher.final(),
        ])

        return {
            s: salt.toString('hex'),
            iv: iv.toString('hex'),
            data: encrypted.toString('hex'),
        }
    }

    /**
     * @param {EncryptedPayload} encryptedPayload
     * @returns {Buffer}
     */
    static decrypt(encryptedPayload) {
        const iv = Buffer.from(encryptedPayload.iv, 'hex')
        const salt = Buffer.from(encryptedPayload.s, 'hex')
        const data = Buffer.from(encryptedPayload.data, 'hex')
        const decipher = crypto.createDecipheriv(
            EncryptServices.algorithm,
            crypto.scryptSync(process.env.APP_SECRET, salt, 32),
            iv,
        )
        return Buffer.concat([decipher.update(data), decipher.final()])
    }

    /**
     * @param {EncryptedPayload} encryptedPayload
     * @returns {string}
     */
    static encrytpedPayloadToString(encryptedPayload) {
        return JSON.stringify(encryptedPayload)
    }
    /**
     * @param {string} string
     * @returns {EncryptedPayload}
     */
    static stringToEncryptedPayload(string) {
        return JSON.parse(string)
    }

    /**
     * @param {EncryptedPayload} encryptedPayload
     * @returns {string}
     */
    static encryptedPayloadToBase64(encryptedPayload) {
        return Buffer.from(
            this.encrytpedPayloadToString(encryptedPayload),
        ).toString('base64')
    }

    /**
     * @param {string} base64
     * @returns {EncryptedPayload}
     */
    static base64ToEncryptedPayload(base64) {
        return this.stringToEncryptedPayload(
            Buffer.from(base64, 'base64').toString(),
        )
    }
}
