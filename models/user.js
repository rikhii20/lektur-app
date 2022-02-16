"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Course, {
        as: "course",
        foreignKey: "user_id",
      });
      User.hasMany(models.StudentCourse, {
        as: "courses",
        foreignKey: "student_id",
      });
      User.hasMany(models.StudentQuestion, {
        as: "question",
        foreignKey: "student_id",
      });
      User.hasMany(models.StudentContent, {
        as: "progress",
        foreignKey: "student_id",
      });
    }
  }
  User.init(
    {
      fullName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
