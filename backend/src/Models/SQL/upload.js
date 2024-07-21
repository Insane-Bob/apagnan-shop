'use scrict'
import { Model } from 'sequelize'

function model(sequelize, DataTypes) {
    class Upload extends Model {}

    Upload.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            path:{
                type: DataTypes.STRING,
                allowNull: false
            },
            hash:{
                type: DataTypes.STRING,
                allowNull: false
            },
            mime:{
                type: DataTypes.STRING,
                allowNull: false
            },
            createdAt: DataTypes.DATE,
            url:{
                type: DataTypes.VIRTUAL,
                get(){
                    return `${process.env.APP_URL}/api/uploads/${this.hash}`
                }
            }
        },
        {
            sequelize,
            modelName: 'Upload',
            updatedAt: false

        },
    )
    return Upload
}

export default model
