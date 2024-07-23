import { Controller } from '../../Core/Controller.js'
import { File, FileEncryptedException } from '../../lib/File.js'
import {ForbiddenException, NotFoundException, UnprocessableEntity} from '../../Exceptions/HTTPException.js'
import {Database} from "../../Models/index.js";
import {UploadPolicy} from "../Policies/UploadPolicy.js";
export class UploadController extends Controller {
    async show() {
        let fileName = this.req.params.get('file')
        let dbFile = await Database.getInstance().models.Upload.findOne({
            where: {
                hash: fileName
            }
        })
        NotFoundException.abortIf(!dbFile)
        let file = new File()
        try {
            file.load(fileName, this.req.getUser()?.id)
            this.res.setHeader('Content-Type', dbFile.mime)
            this.res.send(file.buffer)
        } catch (e) {
            ForbiddenException.abortIf(e instanceof FileEncryptedException)
            throw e
        }
    }

    async upload(){
        this.can(UploadPolicy.upload)

        let file = new File()
        let reqFile = this.req.files.get('file')
        UnprocessableEntity.abortIf(!reqFile, "Please provide a file")

        file.setData(reqFile.data)
        let path = file.save()

        let dbFile = await Database.getInstance().models.Upload.create({
            name: reqFile.name,
            hash: file.name,
            mime: reqFile.mimetype,
            path,
        })

       this.res.json({
           file:dbFile
       })
    }
}
