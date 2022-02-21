"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Questions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      assessment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Assessments",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      question: {
        type: Sequelize.STRING,
      },
      remarks: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Questions");
  },
};
