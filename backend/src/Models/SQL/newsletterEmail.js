import { Model } from 'sequelize'

function model(sequelize, DataTypes) {
    class NewsletterEmail extends Model {}
    NewsletterEmail.init(
        {
            email: {
                type: DataTypes.STRING,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
            },
        },
        {
            sequelize,
            modelName: 'NewsletterEmail',
            updatedAt: false,
        },
    )
    return NewsletterEmail
}
export default model
