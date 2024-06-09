"use strict";
import { Model } from "sequelize";
import slugify from "slugify";

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
      slug: DataTypes.STRING,
      description: DataTypes.STRING,
      published: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Collection",
      hooks: {
        beforeCreate: (collection) => {
          collection.slug = slugify(collection.name, { lower: true });
        },
        beforeUpdate: (collection) => {
          collection.slug = slugify(collection.name, { lower: true });
        },
      },
    }
  );
  return Collection;
}

export default model;
