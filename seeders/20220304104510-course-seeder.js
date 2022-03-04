"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Courses",
      [
        {
          title: "belajar golang",
          image:
            "https://res.cloudinary.com/dcxy3vmrl/image/upload/v1646388824/image/1646388822078-hqdefault.jpg.jpg",
          description: "belajar golang untuk pemula",
          user_id: 1,
          category_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
