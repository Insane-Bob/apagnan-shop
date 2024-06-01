"use strict";
import { Model } from "sequelize";
function model(sequelize, DataTypes) {
  class Collection extends Model {
    static associate(models) {
      // define association here
    }
  }
  Collection.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      published: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Collection",
    }
  );
  return Collection;
}

export default model;
