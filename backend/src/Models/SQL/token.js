'use strict';
import {Model} from 'sequelize';
function model(sequelize, DataTypes) {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        models.Token.belongsTo(models.User, {foreignKey: 'userId'})
    }
  }
  Token.init({
    userId: DataTypes.INTEGER,
    identifier: DataTypes.STRING,
    expireAt: DataTypes.DATE,
    refreshToken: DataTypes.STRING,
    revoked: DataTypes.BOOLEAN,
    createdAt:{
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Token',
  });
  return Token;
};
export default model