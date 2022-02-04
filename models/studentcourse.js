'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StudentCourse.init({
    course_id: DataTypes.INTEGER,
    done: DataTypes.STRING,
    remain: DataTypes.STRING,
    student_id: DataTypes.INTEGER,
    teacher_id: DataTypes.INTEGER,
    assessmentScore: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'StudentCourse',
  });
  return StudentCourse;
};