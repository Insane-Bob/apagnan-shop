'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UserWidgets', {
      id : {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId:{
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      data:{
        type: Sequelize.JSON,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('UserWidget')
  }
};
