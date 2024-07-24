import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { EncryptServices } from '../Services/EncryptServices.js'

export class FileEncryptedException extends Error {}

export class File {
    constructor() {
        this.encryptedFor = null
        this.buffer = null
    }

    async getMimeType() {
        let fileType = await import('file-type')
        let type = await fileType.fileTypeFromBuffer(this.buffer)
        return type?.mime || 'text/plain; charset=utf-8'
    }

    load(name, userId = null, dirPath = 'uploads') {
        this.name = name
        this.buffer = fs.readFileSync(path.resolve(dirPath, name))
        let isEncrypted = this.isEncrypted()
        if (isEncrypted) {
            this.decrypt(userId)
        }
        return this
    }

    setData(buffer) {
        if (!Buffer.isBuffer(buffer)) buffer = Buffer.from(buffer)
        this.buffer = buffer
        this.setName()
        return this
    }

    save(dirPath = 'uploads', prefix = '') {
        let exists = fs.existsSync(dirPath)
        this.name = prefix + this.name
        if (!exists) {
            fs.mkdirSync(dirPath, {
                recursive: true,
            })
        }
        dirPath = path.resolve(dirPath, this.name)
        fs.writeFileSync(dirPath, this.getBufferData())
        return dirPath
    }

    setName() {
        this.name = crypto.createHash('sha1').update(this.buffer).digest('hex')
    }

    getBufferData() {
        if (this.encryptedFor) {
            const encryptedPayload = EncryptServices.encrypt(this.buffer)
            return Buffer.from(
                JSON.stringify({
                    ...encryptedPayload,
                    encrypted: true,
                    userId: this.encryptedFor,
                }),
            )
        } else {
            return this.buffer
        }
    }

    encryptFor(userId) {
        this.encryptedFor = userId
        return this
    }

    readEncrypted() {
        try {
            const json = JSON.parse(this.buffer.toString())
            return json
        } catch (e) {
            return false
        }
    }

    decrypt(userId = null) {
        const json = this.readEncrypted()
        if (json && json.encrypted) {
            if (json.userId !== userId) {
                throw new FileEncryptedException(
                    'User not allowed to decrypt this file',
                )
            }
            this.buffer = EncryptServices.decrypt(json)
        }
    }

    isEncrypted() {
        let hasEncrypted = this.readEncrypted()
        if (hasEncrypted?.encrypted) {
            return hasEncrypted
        }
        return false
    }
}
