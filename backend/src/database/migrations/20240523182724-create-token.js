'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      identifier: {
        type: Sequelize.STRING
      },
      expireAt: {
        type: Sequelize.DATE
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
        () => queryInterface.addConstraint('Tokens', {
              fields: ['userId'],
              type: 'foreign key',
              name: 'fk_user_id',
              references: {
                table: 'Users',
                field: 'id'
              },
              onDelete: 'cascade',
              onUpdate: 'cascade'
        })
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tokens');
  }
};