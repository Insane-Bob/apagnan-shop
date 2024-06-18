'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Reviews', [
            {
                rate: 3,
                content: 'Review of product 1 - 1',
                productId: 1,
                userId: 1,
            },
            {
                rate: 4,
                content: 'Review of product 1 - 2',
                productId: 1,
                userId: 2,
            },
            {
                rate: 5,
                content: 'Review of product 2 - 1',
                productId: 2,
                userId: 1,
            },
            {
                rate: 4,
                content: 'Review of product 2 - 2',
                productId: 2,
                userId: 2,
            },
            {
                rate: 5,
                content: 'Review of product 3 - 1',
                productId: 3,
                userId: 1,
            },
            {
                rate: 4,
                content: 'Review of product 3 - 2',
                productId: 3,
                userId: 2,
            },
        ])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Reviews', null, {})
    },
}
