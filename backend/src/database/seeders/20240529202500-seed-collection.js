"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Collections", [
      {
        id: 1,
        name: "Collection 1",
        description: "Notre première collection à decouvrir",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Collection 2",
        description: "En voila une belle collection",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Collection 3",
        description: "Ceci est une collection trop cool",
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Collections", null, {});
  },
};
