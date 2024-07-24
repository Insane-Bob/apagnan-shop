import { Model } from 'sequelize'
import slugify from 'slugify'

export class LegalDocument extends Model {}

export default (sequelize, DataTypes) => {
    LegalDocument.init(
        {
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            published: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: 'LegalDocument',
            tableName: 'LegalDocuments',
            hooks: {
                beforeValidate: (document) => {
                    document.slug = slugify(document.name, { lower: true })
                },
            },
        },
    )

    return LegalDocument
}
