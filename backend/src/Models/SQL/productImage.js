import {Model} from "sequelize";

class ProductImage extends Model{
    static associate(models){
        ProductImage.belongsTo(models.Product,{
            foreignKey: 'productId'
        });
        ProductImage.belongsTo(models.Upload,{
            foreignKey: 'uploadId',
            as: 'file'
        });
    }

    static addScopes(models){
        models.ProductImage.addScope('defaultScope', {
            include: [
                {
                    model: models.Upload,
                    as: 'file'
                }
            ]
        });
    }
}

function model(sequelize,DataTypes){

    ProductImage.init({
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        productId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        uploadId:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        url:{
            type: DataTypes.VIRTUAL,
            get(){
                return this.file.url
            }
        }
    },{
        sequelize,
        modelName: 'ProductImage',
        tableName: 'ProductImages',
        createdAt: false,
        updatedAt: false
    });

    return ProductImage;
}

export default model;