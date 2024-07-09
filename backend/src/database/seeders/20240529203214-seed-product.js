'use strict'
const slugify = require('slugify')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const products = [
            {
                id: 1,
                name: 'Product 1',
                description: 'Description of product 1',
                price: 100,
                published: true,
                stockTransactions: [
                    {
                        quantity: 10,
                        createdAt: new Date(),
                    },
                    {
                        quantity: 10,
                        createdAt: new Date(),
                    },
                    {
                        quantity: -5,
                        createdAt: new Date(),
                    },
                ],
                collectionId: 1,
            },
            {
                id: 2,
                name: 'Product 2',
                description: 'Description of product 2',
                price: 200,
                published: true,
                stockTransactions: [
                    {
                        quantity: 20,
                        createdAt: new Date(),
                    },
                    {
                        quantity: 20,
                        createdAt: new Date(),
                    },
                    {
                        quantity: -10,
                        createdAt: new Date(),
                    },
                ],
                collectionId: 1,
            },
            {
                id: 3,
                name: 'Product 3',
                description: 'Description of product 3',
                price: 300,
                published: true,
                stockTransactions: [
                    {
                        quantity: 30,
                        createdAt: new Date(),
                    },
                    {
                        quantity: 30,
                        createdAt: new Date(),
                    },
                    {
                        quantity: -15,
                        createdAt: new Date(),
                    },
                ],
                collectionId: 2,
            },
            {
                id: 4,
                name: 'Product 4',
                description: 'Description of product 4',
                price: 400,
                published: true,
                stockTransactions: [
                    {
                        quantity: 40,
                        createdAt: new Date(),
                    },
                    {
                        quantity: 40,
                        createdAt: new Date(),
                    },
                    {
                        quantity: -20,
                        createdAt: new Date(),
                    },
                ],
                collectionId: 2,
            },
            {
                id: 5,
                name: 'Product 5',
                description: 'Description of product 5',
                price: 500,
                published: true,
                stockTransactions: [
                    {
                        quantity: 50,
                        createdAt: new Date(),
                    },
                    {
                        quantity: 50,
                        createdAt: new Date(),
                    },
                    {
                        quantity: -25,
                        createdAt: new Date(),
                    },
                ],
                collectionId: 3,
            },
            {
                id: 6,
                name: 'Product 6',
                description: 'Description of product 6',
                price: 600,
                published: true,
                stockTransactions: [
                    {
                        quantity: 60,
                        createdAt: new Date(),
                    },
                    {
                        quantity: 60,
                        createdAt: new Date(),
                    },
                    {
                        quantity: -30,
                        createdAt: new Date(),
                    },
                ],
                collectionId: 3,
            },
        ]

        //insert all stock transactions
        products.forEach((product) => {
            product.stockTransactions.forEach((stockTransaction) => {
                stockTransaction.productId = product.id
            })
        })

        const stockTransactions = products.flatMap(
            (product) => product.stockTransactions,
        )

        products.forEach((product) => {
            product.slug = slugify(product.name, { lower: true })
            delete product.stockTransactions
        })

        await queryInterface.bulkInsert('Products', products)
        await queryInterface.bulkInsert('StockTransactions', stockTransactions)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Products', null, {})
        await queryInterface.bulkDelete('StockTransactions', null, {})
    },
}
