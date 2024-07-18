export default async function () {
    const products = await this.references.get('products')
    const collections = await this.references.get('collections')

    for (let product of products) {
        await this.db.models.Upload.create({
            path: 'uploads/product/green-gnome.png',
            modelId: product.id,
            modelName: 'product',
        })
    }

    for (let collection of collections) {
        await this.db.models.Upload.create({
            path: 'uploads/collection/main-gnome.webp',
            modelId: collection.id,
            modelName: 'collection',
        })
    }
}
