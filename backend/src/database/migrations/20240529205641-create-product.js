"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable("Products", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
        },
        description: {
          type: Sequelize.TEXT("tiny"),
        },
        price: {
          type: Sequelize.DECIMAL,
        },
        published: {
          type: Sequelize.BOOLEAN,
        },
        stock: {
          type: Sequelize.INTEGER,
        },
        collectionId: {
          type: Sequelize.INTEGER,
        },
        createdAt: {
          type: Sequelize.DATE,
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        deletedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      })
      .then(() => {
        queryInterface.addConstraint("Products", {
          fields: ["collectionId"],
          type: "foreign key",
          name: "products_collectionId_fkey",
          references: {
            table: "Collections",
            field: "id",
          },
          onDelete: "cascade",
          onUpdate: "cascade",
        });
      });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products");
  },
};
