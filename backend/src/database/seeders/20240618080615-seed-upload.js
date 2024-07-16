'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Uploads', [
            {
                modelId: 1,
                modelName: 'collection',
                path: 'uploads/collection/main-gnome.webp',
            },
            {
                modelId: 1,
                modelName: 'product',
                path: 'uploads/product/green-gnome.png',
            },
            {
                modelId: 1,
                modelName: 'product',
                path: 'uploads/product/green-gnome.png',
            },
            {
                modelId: 1,
                modelName: 'product',
                path: 'uploads/product/green-gnome.png',
            },
        ])
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Uploads', null, {})
    },
}
