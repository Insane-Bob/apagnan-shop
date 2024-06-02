'use strict';

import {DenormalizableModel} from "../lib/Denormalizer/DenormalizableModel.js";
import {DenormalizerTaskBuilder} from "../lib/Denormalizer/DenormalizerTaskBuilder.js";
import {SearchUserDocument} from "../lib/Denormalizer/Documents/search/SearchUserDocument.js";

function model(sequelize, DataTypes) {

  class User extends DenormalizableModel {
    static associate(models) {
      models.User.hasOne(models.Customer, {foreignKey: 'userId'})
      models.User.hasMany(models.Token, {foreignKey: 'userId'})
    }
  }

  User.registerDenormalizerTask(
      DenormalizerTaskBuilder
          .create()
          .in('search_user')
          .to(SearchUserDocument)
  )

  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
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
    modelName: 'User',
  });

  return User;
};

export default model