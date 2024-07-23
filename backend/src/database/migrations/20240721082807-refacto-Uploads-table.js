'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.dropTable('Uploads');
    await queryInterface.createTable('Uploads', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name:{
        type: Sequelize.STRING,
        allowNull: false
      },
      path:{
        type: Sequelize.STRING,
        allowNull: false
      },
      hash:{
        type: Sequelize.STRING,
        allowNull: false
      },
      mime:{
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt:{
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });

    await queryInterface.createTable('ProductImages', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      productId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'id'
        }
      },
      uploadId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Uploads',
          key: 'id'
        }
      },

    });

    //create in collection a column for the image
    await queryInterface.addColumn('Collections', 'imageId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Uploads',
        key: 'id'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductImages');
    await queryInterface.removeColumn('Collections', 'imageId');
    await queryInterface.dropTable('Uploads');
    await queryInterface.createTable('Uploads', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      modelId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      modelName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  }
};

