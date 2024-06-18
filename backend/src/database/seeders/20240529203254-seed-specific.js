"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Specifics", [
      {
        name: "Specific 1",
        content: "Content of specific 1",
        productId: 1,
      },
      {
        name: "Specific 2",
        content: "Content of specific 2",
        productId: 1,
      },
      {
        name: "Specific 3",
        content: "Content of specific 3",
        productId: 2,
      },
      {
        name: "Specific 4",
        content: "Content of specific 4",
        productId: 2,
      },
      {
        name: "Specific 5",
        content: "Content of specific 5",
        productId: 3,
      },
      {
        name: "Specific 6",
        content: "Content of specific 6",
        productId: 3,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Specifics", null, {});
  },
};
