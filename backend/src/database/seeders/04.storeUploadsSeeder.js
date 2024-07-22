import fs from 'fs'
import path from "path";
import { File } from '../../lib/File.js'
export default async function () {
    const products = await this.references.get('products')
    const collections = await this.references.get('collections')

    let images = fs.readdirSync(path.resolve('src/database/seeders/images/store'))
    let files = await Promise.all(images.map(async (image) => {
        let _f = new File()
        _f.setData(fs.readFileSync(path.resolve('src/database/seeders/images/store/' + image)))
        let _path = _f.save()
        let dbFile = await this.db.models.Upload.create({
            name: image,
            mime: 'image/png',
            hash: _f.name,
            path:_path
        })
        return dbFile
    }))


    let productFiles = files.filter(f=>f.name.includes('nain#'))
    let collectionFile = files.find(f=>f.name.includes('collection'))
    if(!collectionFile) throw new Error('Collection image not found')
    if(!productFiles.length) throw new Error('Product images not found')


    for(let image of productFiles){
        for(let product of products){
            await this.db.models.ProductImage.create({
                productId: product.id,
                uploadId: image.id
            })
        }
    }
    
    for (let collection of collections) {
        collection.imageId = collectionFile.id
        await collection.save()
    }
}
