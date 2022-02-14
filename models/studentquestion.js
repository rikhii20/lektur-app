'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     
    static associate(models) {
      // define association here
      StudentQuestion.belongsTo(models.User, {
        as: "student",
        foreignKey: "student_id",
      });
      StudentQuestion.belongsTo(models.Course, {
        as: "course",
        foreignKey : "course_id",
      });
      StudentQuestion.belongsTo(models.Question, {
        as: "question",
        foreignKey : "question_id",
      });
    }
  }
  StudentQuestion.init({
    student_id: DataTypes.INTEGER,
    question_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'StudentQuestion',
  });
  return StudentQuestion;
};