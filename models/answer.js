"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Answer.belongsTo(models.Question, {
        as: "question",
        foreignKey: "question_id",
      });
    }
  }
  Answer.init(
    {
      description: DataTypes.TEXT,
      question_id: DataTypes.INTEGER,
      value: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Answer",
    },
  );
  return Answer;
};
