'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  StudentOption.init({
    optionId: DataTypes.INTEGER,
    studentQuestionId: DataTypes.INTEGER,
    isChoosen: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'StudentOption',
  });
  return StudentOption;
};