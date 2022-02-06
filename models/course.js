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
        as: "users",
        foreignKey: "user_id",
      });
      Course.hasMany(models.Category, {
        as: "category",
        foreignKey: "category_id",
      });
      Course.hasMany(models.Content, {
        as: "content",
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
