'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        //add addressId to orders
        await queryInterface.addColumn('Orders', 'addressId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'BillingAddresses',
                key: 'id',
            },
        })

        //create status order column
        await queryInterface.addColumn('Orders', 'status', {
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: 'pending',
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Orders', 'addressId')
        await queryInterface.removeColumn('Orders', 'status')
    },
}
