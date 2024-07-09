'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn('UserBaskets', 'productId')

        await queryInterface.addColumn('UserBaskets', 'productId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('UserBaskets', 'productId')
        await queryInterface.addColumn('UserBaskets', 'productId', {
            type: Sequelize.INTEGER,
            allowNull: false,
        })
    },
}
