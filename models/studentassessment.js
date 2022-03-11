"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentAssessment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentAssessment.belongsTo(models.User, {
        as: "student",
        foreignKey: "studentId",
      });
      StudentAssessment.belongsTo(models.Course, {
        as: "course",
        foreignKey: "courseId",
      });
    }
  }
  StudentAssessment.init(
    {
      studentId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "StudentAssessment",
    },
  );
  return StudentAssessment;
};
