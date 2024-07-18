'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Orders', 'codePromo', {
            type: Sequelize.STRING(50),
            allowNull: true,
        })

        await queryInterface.addColumn('Orders', 'promoValue', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
        })

        await queryInterface.addColumn('Orders', 'promoType', {
            type: Sequelize.STRING(50),
            allowNull: true,
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Orders', 'codePromo')
        await queryInterface.removeColumn('Orders', 'promoValue')
        await queryInterface.removeColumn('Orders', 'promoType')
    },
}
