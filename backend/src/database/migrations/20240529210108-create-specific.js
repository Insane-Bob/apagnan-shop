"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable("Specifics", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: Sequelize.STRING,
        content: Sequelize.TEXT,
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        productId: Sequelize.INTEGER,
      })
      .then(() => {
        queryInterface.addConstraint("Specifics", {
          fields: ["productId"],
          type: "foreign key",
          name: "specifics_productId_fkey",
          references: {
            table: "Products",
            field: "id",
          },
          onDelete: "cascade",
          onUpdate: "cascade",
        });
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Specifics");
  },
};
