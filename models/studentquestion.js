"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudentQuestion.init(
    {
      questionId: DataTypes.INTEGER,
      studenAssessmentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "StudentQuestion",
    },
  );
  return StudentQuestion;
};
