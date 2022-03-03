"use strict";
const { Model } = require("sequelize");
const assessment = require("./assessment");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.belongsTo(models.Assessment, {
        as: "assessment",
        foreignKey: "assessment_id",
      });
      Question.hasMany(models.Option, {
        as: "options",
        foreignKey: "question_id",
      });
    }
  }
  Question.init(
    {
      assessment_id: DataTypes.INTEGER,
      question: DataTypes.STRING,
      remarks: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Question",
    },
  );
  return Question;
};
