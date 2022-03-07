"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("StudentOptions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      optionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Options",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      studentQuestionId: {
        type: Sequelize.INTEGER,
        references: {
          model: "StudentQuestions",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      isChoosen: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StudentOptions");
  },
};
