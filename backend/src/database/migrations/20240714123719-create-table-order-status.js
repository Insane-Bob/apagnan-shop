'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('OrderStatuses', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            status: {
                type: Sequelize.STRING(50),
                allowNull: false,
                defaultValue: 'pending',
            },
            orderId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Orders',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        })

        await queryInterface.removeColumn('Orders', 'status')
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('Orders', 'status', {
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: 'pending',
        })
        await queryInterface.dropTable('OrderStatuses')
    },
}
