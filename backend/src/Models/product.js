"use strict";
import { Model } from "sequelize";
function model(sequelize, DataTypes) {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Collection, {
        foreignKey: "collectionId",
      });
      Product.hasMany(models.Specific, {
        foreignKey: "productId",
      });
      Product.hasMany(models.Review, {
        foreignKey: "productId",
      });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      published: DataTypes.BOOLEAN,
      stock: DataTypes.INTEGER,
      collectionId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
}

export default model;
