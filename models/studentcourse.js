"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentCourse.belongsTo(models.User, {
        as: "students",
        foreignKey: "student_id",
      });
      StudentCourse.belongsTo(models.Course, {
        as: "course",
        foreignKey: "course_id",
      });
    }
  }
  StudentCourse.init(
    {
      student_id: DataTypes.INTEGER,
      course_id: DataTypes.INTEGER,
      assessmentScore: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "StudentCourse",
    },
  );
  return StudentCourse;
};
