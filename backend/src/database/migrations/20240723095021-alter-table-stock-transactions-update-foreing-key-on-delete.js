'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        //drop foreign key
        await queryInterface.removeConstraint(
            'StockTransactions',
            'StockTransactions_productId_fkey',
        )

        await queryInterface.changeColumn('StockTransactions', 'productId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id',
            },
            onDelete: 'CASCADE',
        })

        //drop forein key on Product images
        await queryInterface.removeConstraint(
            'ProductImages',
            'ProductImages_productId_fkey',
        )

        await queryInterface.changeColumn('ProductImages', 'productId', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id',
            },
            onDelete: 'CASCADE',
        })
    },

    async down(queryInterface, Sequelize) {},
}
