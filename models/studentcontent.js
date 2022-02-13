"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentContent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      StudentContent.belongsTo(models.Content, {
        as: "content",
        foreignKey: "content_id",
      });
      StudentContent.belongsTo(models.Course, {
        as: "course",
        foreignKey: "course_id",
      });
    }
  }
  StudentContent.init(
    {
      student_id: DataTypes.INTEGER,
      course_id: DataTypes.INTEGER,
      content_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "StudentContent",
    },
  );
  return StudentContent;
};
