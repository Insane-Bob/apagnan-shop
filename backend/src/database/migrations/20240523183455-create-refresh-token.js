'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RefreshTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tokenId: {
        type: Sequelize.INTEGER
      },
      expireAt: {
        type: Sequelize.DATE
      },
      identifier: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(
        () => queryInterface.addConstraint('RefreshTokens', {
              fields: ['tokenId'],
              type: 'foreign key',
              name: 'fk_token_id',
              references: {
                table: 'Tokens',
                field: 'id'
              },
              onDelete: 'cascade',
              onUpdate: 'cascade'
        })
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RefreshTokens');
  }
};