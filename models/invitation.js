'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Invitation.init({
    studentEmail: DataTypes.STRING,
    teacher_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER,
    isApproved: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Invitation',
  });
  return Invitation;
};