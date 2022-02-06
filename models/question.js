'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.belongsTo(
        models.Course, {
        as: "courses",
        foreignKey: "course_id"
      }
      )
    }
  }
  Question.init({
    description: DataTypes.TEXT,
    correctAnswer: DataTypes.STRING,
    remark: DataTypes.STRING,
    course_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Question',
  });
  return Question;
};