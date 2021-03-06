"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.User, {
        as: "by",
        foreignKey: "user_id",
      });
      Course.belongsTo(models.Category, {
        as: "category",
        foreignKey: "category_id",
      });
      Course.hasMany(models.Content, {
        as: "contents",
        foreignKey: "course_id",
      });
      Course.hasMany(models.StudentCourse, {
        as: "enrolledStudents",
        foreignKey: "course_id",
      });
      Course.hasOne(models.StudentCourse, {
        as: "status",
        foreignKey: "course_id",
      });
      Course.hasMany(models.StudentContent, {
        as: "progress",
        foreignKey: "course_id",
      });
      Course.hasOne(models.Assessment, {
        as: "assessment",
        foreignKey: "course_id",
      });
    }
  }
  Course.init(
    {
      title: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.TEXT,
      user_id: DataTypes.INTEGER,
      category_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Course",
    },
  );
  return Course;
};
