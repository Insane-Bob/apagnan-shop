'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface
            .createTable('Reviews', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
                rate: Sequelize.INTEGER,
                content: Sequelize.TEXT('tiny'),
                productId: Sequelize.INTEGER,
                userId: Sequelize.INTEGER,
                updatedAt: Sequelize.DATE,
                createdAt: Sequelize.DATE,
            })
            .then(() => {
                queryInterface.addConstraint('Reviews', {
                    fields: ['productId'],
                    type: 'foreign key',
                    name: 'reviews_productId_fkey',
                    references: {
                        table: 'Products',
                        field: 'id',
                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade',
                })
                queryInterface.addConstraint('Reviews', {
                    fields: ['userId'],
                    type: 'foreign key',
                    name: 'reviews_userId_fkey',
                    references: {
                        table: 'Users',
                        field: 'id',
                    },
                    onDelete: 'cascade',
                    onUpdate: 'cascade',
                })
            })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Reviews')
    },
}
