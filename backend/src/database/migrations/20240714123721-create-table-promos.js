'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Promos', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            available: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 'false',
            },
            value: {
                type: Sequelize.DECIMAL,
                allowNull: false,
                defaultValue: 0,
            },
            type: {
                type: Sequelize.ENUM,
                values: ['percent', 'amount'],
                allowNull: false,
                defaultValue: 'percent',
            },
            code: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            promoted: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: 'false',
            },
            stripeId: {
                type: Sequelize.STRING,
                allowNull: true,
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Promos')
    },
}
