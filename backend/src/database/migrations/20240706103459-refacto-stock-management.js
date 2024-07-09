'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.removeColumn('UserBaskets', 'productId')
        queryInterface.removeColumn('UserBaskets', 'quantity')
        queryInterface.removeColumn('Products', 'stock')
        queryInterface.addColumn('UserBaskets', 'stockTransactionId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'StockTransactions',
                key: 'id',
            },
        })
    },

    async down(queryInterface, Sequelize) {
        queryInterface.addColumn('Products', 'stock', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        })
        queryInterface.removeColumn('UserBaskets', 'stockTransactionId')
        queryInterface.addColumn('UserBaskets', 'productId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id',
            },
        })

        queryInterface.addColumn('UserBaskets', 'quantity', {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        })
    },
}
