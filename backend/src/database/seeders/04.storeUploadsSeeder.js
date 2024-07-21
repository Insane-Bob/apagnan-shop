export default async function () {
    const products = await this.references.get('products')
    const collections = await this.references.get('collections')

    const uploaded = await this.db.models.Upload.create({
        name: 'green-gnome.png',
        mime: 'image/png',
        hash: '123456',
        path: 'uploads/123456',
    })



    for (let product of products) {
        await this.db.models.ProductImage.create({
            productId: product.id,
            uploadId: uploaded.id,
        })
    }
    for (let collection of collections) {
        collection.imageId = uploaded.id
        await collection.save()
    }
}
