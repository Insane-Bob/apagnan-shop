"use strict";
import { Model } from "sequelize";
function model(sequelize, DataTypes) {
  class Specific extends Model {
    static associate(models) {
      Specific.belongsTo(models.Product, {
        foreignKey: "productId",
      });
    }
  }
  Specific.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      content: DataTypes.STRING,
      productId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Specific",
    }
  );
  return Specific;
}

export default model;
