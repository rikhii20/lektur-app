"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Assessment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Assessment.hasMany(models.Question, {
        as: "questions",
        foreignKey: "assessment_id",
      });
      Assessment.belongsTo(models.Course, {
        as: "course",
        foreignKey: "course_id",
      });
    }
  }
  Assessment.init(
    {
      course_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Assessment",
    },
  );
  return Assessment;
};
