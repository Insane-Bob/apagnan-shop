'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('OrderRefunds', 'creditNoteId', {
            type: Sequelize.STRING,
        })
    },

    async down(queryInterface, Sequelize) {
       await queryInterface.removeColumn('OrderRefunds', 'creditNoteId')
    },
}
