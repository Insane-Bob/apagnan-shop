'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('OrderRefunds', {
            refundId: {
                type: Sequelize.STRING(40),
                primaryKey: true,
                allowNull: false,
            },
            requestRefundId: {
                type: Sequelize.INTEGER,
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

        await queryInterface.addConstraint('OrderRefunds', {
            fields: ['requestRefundId'],
            type: 'foreign key',
            name: 'order_refunds_requestRefundId_fkey',
            references: {
                table: 'RefundRequestOrders',
                field: 'id',
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

        await queryInterface.dropTable('OrderRefunds')
    },
}
