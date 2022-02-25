'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Option extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Option.belongsTo(models.Question, {
        as: "options",
        foreignKey: "question_id"
      })
    }
  };
  Option.init({
    question_id: DataTypes.INTEGER,
    option: DataTypes.STRING,
    isTrue: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Option',
  });
  return Option;
};