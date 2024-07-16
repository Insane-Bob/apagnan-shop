'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        //create atble UserBaskets
        await queryInterface.createTable('UserBaskets', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            productId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        })

        //add foreign key to UserBaskets
        await queryInterface.addConstraint('UserBaskets', {
            fields: ['userId'],
            type: 'foreign key',
            name: 'fk_user_id',
            references: {
                table: 'Users',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('UserBaskets')
    },
}
