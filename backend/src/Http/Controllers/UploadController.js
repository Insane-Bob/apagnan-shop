import { Controller } from '../../Core/Controller.js'
import { File, FileEncryptedException } from '../../lib/File.js'
import { ForbiddenException } from '../../Exceptions/HTTPException.js'
export class UploadController extends Controller {
    async show() {
        let fileName = this.req.params.get('file')
        let file = new File()
        try {
            file.load(fileName, this.req.getUser()?.id)
            this.res.setHeader('Content-Type', await file.getMimeType())
            this.res.send(file.buffer)
        } catch (e) {
            ForbiddenException.abortIf(e instanceof FileEncryptedException)
            throw e
        }
    }
}
