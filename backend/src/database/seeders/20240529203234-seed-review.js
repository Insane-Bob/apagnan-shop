'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const Products = await queryInterface.sequelize.query(
            `SELECT * FROM "Products";`,
            { type: Sequelize.QueryTypes.SELECT },
        )
        const CountProducts = Products.length

        const Users = await queryInterface.sequelize.query(
            `SELECT * FROM "Users";`,
            { type: Sequelize.QueryTypes.SELECT },
        )
        const CountUsers = Users.length

        const Reviews = [
            {
                rate: 3,
                content: 'My first review',
                productId:
                    Products[Math.floor(Math.random() * CountProducts)].id,
                userId: Users[Math.floor(Math.random() * CountUsers)].id,
            },
            {
                rate: 4,
                content: 'My second review',
                productId:
                    Products[Math.floor(Math.random() * CountProducts)].id,
                userId: Users[Math.floor(Math.random() * CountUsers)].id,
            },
            {
                rate: 5,
                content: 'My third review',
                productId:
                    Products[Math.floor(Math.random() * CountProducts)].id,
                userId: Users[Math.floor(Math.random() * CountUsers)].id,
            },
            {
                rate: 4,
                content: 'My fourth review',
                productId:
                    Products[Math.floor(Math.random() * CountProducts)].id,
                userId: Users[Math.floor(Math.random() * CountUsers)].id,
            },
            {
                rate: 5,
                content: 'My fifth review',
                productId:
                    Products[Math.floor(Math.random() * CountProducts)].id,
                userId: Users[Math.floor(Math.random() * CountUsers)].id,
            },
            {
                rate: 4,
                content: 'My sixth review',
                productId:
                    Products[Math.floor(Math.random() * CountProducts)].id,
                userId: Users[Math.floor(Math.random() * CountUsers)].id,
            },
        ]

        await queryInterface.bulkInsert('Reviews', Reviews)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Reviews', null, {})
    },
}
