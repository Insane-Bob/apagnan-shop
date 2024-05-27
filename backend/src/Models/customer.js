'use strict';
import {Model} from "sequelize";
import {Denormalizer} from "../lib/ModelDenormalizer/core/Denormalizer.js";
function model(sequelize, DataTypes) {
    class Customer extends Model {
        static associate(models) {
            models.Customer.belongsTo(models.User, {foreignKey: 'userId'})
            models.Customer.hasMany(models.BillingAddress, {foreignKey: 'customerId'})
            models.Customer.hasMany(models.Order, {foreignKey: 'customerId'})
        }

    }
    Customer.init({
        userId: DataTypes.INTEGER,
        stripeId : DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Customer',
    });

    return Customer;
};

export default model