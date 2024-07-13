'use strict'
const slugify = require('slugify')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const collections = await queryInterface.sequelize.query(
            `SELECT * FROM "Collections";`,
            { type: Sequelize.QueryTypes.SELECT },
        )
        const CountCollections = collections.length

        const products = [
            {
                name: 'Product 1',
                description: 'Description of product 1',
                price: 100,
                published: true,
                collectionId:
                    collections[Math.floor(Math.random() * CountCollections)]
                        .id,
            },
            {
                name: 'Product 2',
                description: 'Description of product 2',
                price: 200,
                published: true,
                collectionId:
                    collections[Math.floor(Math.random() * CountCollections)]
                        .id,
            },
            {
                name: 'Product 3',
                description: 'Description of product 3',
                price: 300,
                published: true,
                collectionId:
                    collections[Math.floor(Math.random() * CountCollections)]
                        .id,
            },
            {
                name: 'Product 4',
                description: 'Description of product 4',
                price: 400,
                published: true,
                collectionId:
                    collections[Math.floor(Math.random() * CountCollections)]
                        .id,
            },
            {
                name: 'Product 5',
                description: 'Description of product 5',
                price: 500,
                published: true,
                collectionId:
                    collections[Math.floor(Math.random() * CountCollections)]
                        .id,
            },
            {
                name: 'Product 6',
                description: 'Description of product 6',
                price: 600,
                published: true,
                collectionId:
                    collections[Math.floor(Math.random() * CountCollections)]
                        .id,
            },
        ]

        products.forEach((product) => {
            product.slug = slugify(product.name, { lower: true })
        })
        await queryInterface.bulkInsert('Products', products)

        const insertedProducts = await queryInterface.sequelize.query(
            `SELECT * FROM "Products";`,
            { type: Sequelize.QueryTypes.SELECT },
        )

        const stockTransactions = []
        insertedProducts.forEach((product) => {
            const productTransactions = []
            switch (product.name) {
                case 'Product 1':
                    productTransactions.push({
                        quantity: 10,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    productTransactions.push({
                        quantity: 10,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    productTransactions.push({
                        quantity: -5,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    break
                case 'Product 2':
                    productTransactions.push({
                        quantity: 20,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    productTransactions.push({
                        quantity: 20,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    productTransactions.push({
                        quantity: -10,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    break
                case 'Product 3':
                    productTransactions.push({
                        quantity: 30,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    productTransactions.push({
                        quantity: 30,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    productTransactions.push({
                        quantity: -15,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    break
                case 'Product 4':
                    productTransactions.push({
                        quantity: 40,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    productTransactions.push({
                        quantity: 40,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    productTransactions.push({
                        quantity: -20,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    break
                case 'Product 5':
                    productTransactions.push({
                        quantity: 50,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    productTransactions.push({
                        quantity: 50,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    productTransactions.push({
                        quantity: -25,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    break
                case 'Product 6':
                    productTransactions.push({
                        quantity: 60,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    productTransactions.push({
                        quantity: 60,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    productTransactions.push({
                        quantity: -30,
                        createdAt: new Date(),
                        productId: product.id,
                    })
                    break
                default:
                    break
            }
            stockTransactions.push(...productTransactions)
        })

        await queryInterface.bulkInsert('StockTransactions', stockTransactions)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Products', null, {})
        await queryInterface.bulkDelete('StockTransactions', null, {})
    },
}
