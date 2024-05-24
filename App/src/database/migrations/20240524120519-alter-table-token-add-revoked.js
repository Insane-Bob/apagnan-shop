'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn('Tokens', 'revoked', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    })

    await queryInterface.addConstraint('Tokens', {
        fields: ['identifier'],
        type: 'unique',
        name: 'tokens_identifier_unique'
    })

    await queryInterface.addConstraint('Users', {
        fields: ['email'],
        type: 'unique',
        name: 'users_email_unique'
    })
  },

  async down (queryInterface, Sequelize) {
  }
};
