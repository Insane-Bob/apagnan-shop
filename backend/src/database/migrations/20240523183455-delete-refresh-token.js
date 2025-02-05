'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.dropTable('RefreshTokens')

        //add refreshToken column to Tokens
        await queryInterface.addColumn('Tokens', 'refreshToken', {
            type: Sequelize.STRING,
            allowNull: true,
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.createTable('RefreshTokens', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
        })

        await queryInterface.removeColumn('Tokens', 'refreshToken')
    },
}
