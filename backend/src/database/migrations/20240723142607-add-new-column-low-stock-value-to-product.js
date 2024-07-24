'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Products', 'lowStockValue', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 5,
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Products', 'lowStockValue')
    },
}
