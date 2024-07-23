import { Middleware } from '../../Core/Middleware.js'
import fileUpload from 'express-fileupload'
import { BadRequestException } from '../../Exceptions/HTTPException.js'
export class UploadMiddleware extends Middleware {
    /**
     * @param {Request} req
     * @param res
     * @param next
     */
    async handle(req, res, next) {
        let middleware = fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
        })
        middleware(req._req, res, (err) => {
            if (err) {
                throw new BadRequestException(err.message)
            }
            next()
        })
    }
}
