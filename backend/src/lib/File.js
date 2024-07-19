import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

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

    save(dirPath = 'uploads') {
        let exists = fs.existsSync(dirPath)
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
            const iv = crypto.randomBytes(16)
            const cipher = crypto.createCipheriv(
                'aes-256-cbc',
                crypto.scryptSync(process.env.APP_SECRET, 'salt', 32),
                iv,
            )
            const encrypted = Buffer.concat([
                cipher.update(this.buffer),
                cipher.final(),
            ])
            const encryptJSON = JSON.stringify({
                encrypted: true,
                userId: this.encryptedFor,
                iv: iv.toString('hex'),
                data: encrypted.toString('hex'),
            })
            return Buffer.from(encryptJSON)
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

            const iv = Buffer.from(json.iv, 'hex')
            const data = Buffer.from(json.data, 'hex')
            const decipher = crypto.createDecipheriv(
                'aes-256-cbc',
                crypto.scryptSync(process.env.APP_SECRET, 'salt', 32),
                iv,
            )
            this.buffer = Buffer.concat([
                decipher.update(data),
                decipher.final(),
            ])
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
