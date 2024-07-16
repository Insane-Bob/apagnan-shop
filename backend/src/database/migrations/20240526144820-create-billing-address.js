'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Addresses', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            customerId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'Customers',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            street: {
                type: Sequelize.STRING,
            },
            country: {
                type: Sequelize.STRING,
            },
            city: {
                type: Sequelize.STRING,
            },
            region: {
                type: Sequelize.STRING,
            },
            postalCode: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Addresses')
    },
}
