'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const Products = await queryInterface.sequelize.query(
            `SELECT * FROM "Products";`,
            { type: Sequelize.QueryTypes.SELECT },
        )
        const CountProducts = Products.length

        const Specifics = [
            {
                name: 'Specific 1',
                content: 'Content of specific 1',
                productId:
                    Products[Math.floor(Math.random() * CountProducts)].id,
            },
            {
                name: 'Specific 2',
                content: 'Content of specific 2',
                productId:
                    Products[Math.floor(Math.random() * CountProducts)].id,
            },
            {
                name: 'Specific 3',
                content: 'Content of specific 3',
                productId:
                    Products[Math.floor(Math.random() * CountProducts)].id,
            },
            {
                name: 'Specific 4',
                content: 'Content of specific 4',
                productId:
                    Products[Math.floor(Math.random() * CountProducts)].id,
            },
            {
                name: 'Specific 5',
                content: 'Content of specific 5',
                productId:
                    Products[Math.floor(Math.random() * CountProducts)].id,
            },
            {
                name: 'Specific 6',
                content: 'Content of specific 6',
                productId:
                    Products[Math.floor(Math.random() * CountProducts)].id,
            },
        ]

        await queryInterface.bulkInsert('Specifics', Specifics)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Specifics', null, {})
    },
}
