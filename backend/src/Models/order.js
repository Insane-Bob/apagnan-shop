'use strict';
import {Model} from "sequelize";

function model(sequelize, DataTypes) {
    class Order extends Model {
        static associate(models) {
            models.Order.belongsTo(models.Customer, {foreignKey: 'customerId'})
        }
    }
    Order.init({
        customerId: DataTypes.INTEGER,
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
        modelName: 'Order',
    });

    return Order;
};

export default model