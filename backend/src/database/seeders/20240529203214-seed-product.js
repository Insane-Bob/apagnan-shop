"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Products", [
      {
        id: 1,
        name: "Product 1",
        description: "Description of product 1",
        price: 100,
        published: true,
        stock: 10,
        collectionId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Product 2",
        description: "Description of product 2",
        price: 200,
        published: true,
        stock: 20,
        collectionId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Product 3",
        description: "Description of product 3",
        price: 300,
        published: true,
        stock: 30,
        collectionId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: "Product 4",
        description: "Description of product 4",
        price: 400,
        published: true,
        stock: 40,
        collectionId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: "Product 5",
        description: "Description of product 5",
        price: 500,
        published: true,
        stock: 50,
        collectionId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        name: "Product 6",
        description: "Description of product 6",
        price: 600,
        published: true,
        stock: 60,
        collectionId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
