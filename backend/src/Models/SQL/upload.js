'use scrict'
import { Model } from 'sequelize'

function model(sequelize, DataTypes) {
    class Upload extends Model {
        static associate(models) {
            //
        }
    }
    Upload.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            modelId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            modelName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            path: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Upload',
        },
    )
    return Upload
}

export default model
