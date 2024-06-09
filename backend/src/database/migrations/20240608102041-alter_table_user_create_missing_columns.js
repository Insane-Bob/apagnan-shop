'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        //add column email_verified_at to Users table
        await queryInterface.addColumn('Users', 'email_verified_at', {
            type: Sequelize.DATE,
        })

        //add column phone to Users table varchar 20
        await queryInterface.addColumn('Users', 'phone', {
            type: Sequelize.STRING(20),
        })

        //add column role to Users table
        await queryInterface.addColumn('Users', 'role', {
            type: Sequelize.STRING,
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'email_verified_at')
        await queryInterface.removeColumn('Users', 'phone')
        await queryInterface.removeColumn('Users', 'role')
    },
}
