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
      // define association here
    }
  }
  Token.init({
    userId: DataTypes.INTEGER,
    identifier: DataTypes.STRING,
    expireAt: DataTypes.DATE,
    refreshToken: DataTypes.STRING,
    revoked: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Token',
  });
  return Token;
};
export default model