'use strict'
const slugify = require('slugify')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const collections = [
            {
                id: 1,
                name: 'Collection 1',
                description: 'Notre première collection à découvrir',
                published: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                name: 'Collection 2',
                description: 'En voilà une belle collection',
                published: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 3,
                name: 'Collection 3',
                description: 'Ceci est une collection trop cool',
                published: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]

        collections.forEach((collection) => {
            collection.slug = slugify(collection.name, { lower: true })
        })

        await queryInterface.bulkInsert('Collections', collections)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Collections', null, {})
    },
}
