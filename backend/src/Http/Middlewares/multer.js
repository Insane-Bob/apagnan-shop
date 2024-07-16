import { Middleware } from '../../Core/Middleware.js'
import multer from 'multer'
import path from 'path'
import { BadRequestException } from '../../Exceptions/HTTPException.js'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    },
})

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/
    const extname = fileTypes.test(
        path.extname(file.originalname).toLowerCase(),
    )
    const mimetype = fileTypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb(
            new Error(
                'Erreur: Seuls les images JPEG, JPG et PNG sont autorisées!',
            ),
        )
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: fileFilter,
}).any()

export class UploadMiddleware extends Middleware {
    /**
     * @param {Request} req
     * @param res
     * @param next
     */
    async handle(req, res, next) {
        upload(req, res, (err) => {
            if (err) {
                return BadRequestException.abort(err.message)
            }
            next()
        })
    }
}
