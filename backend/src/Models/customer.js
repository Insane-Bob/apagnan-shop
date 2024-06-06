'use strict';
import {DenormalizableModel} from "../lib/Denormalizer/DenormalizableModel.js";
import {DenormalizerTaskBuilder} from "../lib/Denormalizer/DenormalizerTaskBuilder.js";
import {SearchUserDocument} from "../lib/Denormalizer/Documents/search/SearchUserDocument.js";

function model(sequelize, DataTypes) {
    class Customer extends DenormalizableModel {
        static associate(models) {
            models.Customer.belongsTo(models.User, {foreignKey: 'userId'})
            models.Customer.hasMany(models.BillingAddress, {foreignKey: 'customerId'})
            models.Customer.hasMany(models.Order, {foreignKey: 'customerId'})
        }
    }

    Customer.registerDenormalizerTask(
        DenormalizerTaskBuilder.create()
            .in('search_user')
            .fetchFrom(async (customerInstance)=>{
                return await customerInstance.getUser()
            })
            .to(SearchUserDocument)
    )

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