'use strict';
import {Model} from "sequelize";
function model(sequelize, DataTypes) {
    class BillingAddress extends Model {
        static associate(models) {
            models.BillingAddress.belongsTo(models.Customer, {foreignKey: 'customerId'})
        }
    }
    BillingAddress.init({
        customerId: DataTypes.INTEGER,
        street : DataTypes.STRING,
        city : DataTypes.STRING,
        region : DataTypes.STRING,
        postalCode : DataTypes.STRING,
        country : DataTypes.STRING,
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
        modelName: 'BillingAddress',
    });

    return BillingAddress;
};

export default model