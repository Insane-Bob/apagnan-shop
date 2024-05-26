'use strict';
import {Model} from "sequelize";
import {UserDocument} from "../lib/ModelDenormalizer/documents/UserDocument.js";
import {Denormalizer} from "../lib/ModelDenormalizer/core/Denormalizer.js";

function model(sequelize, DataTypes) {
  class User extends Model {
    static associate(models) {
       models.User.hasOne(models.Customer, {foreignKey: 'userId'})
       models.User.hasMany(models.Token, {foreignKey: 'userId'})
    }

    static denormalizers = [
      (databaseInstance)=>
          new Denormalizer()
          .from(this)
          .to(UserDocument)
          .in(databaseInstance.mongoDB.collection('users'))
          .listen()
    ]
  }

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