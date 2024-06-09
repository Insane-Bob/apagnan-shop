const multer = require('multer')
const path = require('path')

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
        cb('Erreur: Seuls les images JPEG, JPG et PNG sont autorisées!')
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limite de fichier à 5MB
    fileFilter: fileFilter,
})

module.exports = upload
