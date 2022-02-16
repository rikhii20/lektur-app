"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Content.belongsTo(models.Course, {
        as: "course",
        foreignKey: "course_id",
      });
      Content.hasMany(models.Material, {
        as: "materials",
        foreignKey: "content_id",
      });
    }
  }
  Content.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      video: DataTypes.STRING,
      course_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Content",
    },
  );
  return Content;
};
