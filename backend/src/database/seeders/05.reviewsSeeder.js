import { ReviewFactory } from '../factories/ReviewFactory.js'

export default async function () {
    const productsIDS = this.references
        .get('products')
        .map((product) => product.id)
    const usersIDS = this.references.get('users').map((user) => user.id)

    const reviews = []
    for (let i = 0; i < 20; i++) {
        let review = await ReviewFactory.create({
            productId: this.randomIn(productsIDS),
            userId: this.randomIn(usersIDS),
        })
        reviews.push(review)
    }
    this.references.set('reviews', reviews)
}
