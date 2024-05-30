"use scrict";
import { Model } from "sequelize";

function model(sequelize, DataTypes) {
  class Review extends Model {
    static associate(models) {
      Review.belongsTo(models.Product, {
        foreignKey: "productId",
      });
      Review.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  Review.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      rate: DataTypes.INTEGER,
      content: DataTypes.STRING,
      productId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
}

export default model;
