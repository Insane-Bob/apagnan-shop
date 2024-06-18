'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('RefundRequestOrders', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            orderId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            sessionId: {
                type: Sequelize.STRING(80),
                allowNull: true,
            },
            reason: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            approved: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        })

        await queryInterface.addConstraint('RefundRequestOrders', {
            fields: ['orderId'],
            type: 'foreign key',
            name: 'refund_request_order_orderId_fkey',
            references: {
                table: 'Orders',
                field: 'id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
        })

        await queryInterface.addConstraint('RefundRequestOrders', {
            fields: ['sessionId'],
            type: 'foreign key',
            name: 'refund_request_order_sessionId_fkey',
            references: {
                table: 'Payments',
                field: 'sessionId',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */

        await queryInterface.dropTable('RefundRequestOrders')
    },
}
