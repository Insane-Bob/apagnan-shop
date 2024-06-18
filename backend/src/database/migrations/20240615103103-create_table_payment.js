'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Payments', {
            sessionId: {
                type: Sequelize.STRING(80),
                allowNull: false,
                primaryKey: true,
            },
            paymentIntentId: {
                type: Sequelize.STRING(80),
                allowNull: true,
            },
            orderId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            status: {
                type: Sequelize.STRING(20),
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

        await queryInterface.addConstraint('Payments', {
            fields: ['orderId'],
            type: 'foreign key',
            name: 'payments_orderId_fkey',
            references: {
                table: 'Orders',
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

        await queryInterface.dropTable('Payments')
    },
}
