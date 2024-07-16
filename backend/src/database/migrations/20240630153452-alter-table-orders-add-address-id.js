'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        //add addressId to orders
        await queryInterface.addColumn('Orders', 'billingAddressId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Addresses',
                key: 'id',
            },
        })

        await queryInterface.addColumn('Orders', 'shippingAddressId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Addresses',
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
        await queryInterface.removeColumn('Orders', 'shippingAddressId')
        await queryInterface.removeColumn('Orders', 'billingAddressId')
        await queryInterface.removeColumn('Orders', 'status')
    },
}
