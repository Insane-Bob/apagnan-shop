'use strict';
import {Model} from 'sequelize';
function model(sequelize, DataTypes) {
  class UserWidget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.UserWidget.belongsTo(models.User, {foreignKey: 'userId'})
    }
  }
  
  UserWidget.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: DataTypes.INTEGER,
    data: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'UserWidget',
    createdAt: false,
    updatedAt: false
  });
  return UserWidget;
};
export default model