'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Reviews', 'approved', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Reviews', 'approved')
    },
}
