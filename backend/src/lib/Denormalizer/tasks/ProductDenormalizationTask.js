import { DenormalizerTask } from '../DenormalizerTask.js'
import { Database } from '../../../Models/index.js'
import { Schema } from 'mongoose'
export class ProductDenormalizationTask extends DenormalizerTask {
    static model = 'Products'
    constructor() {
        super()
    }
    fetch(productsIds) {
        return Database.getInstance()
            .models.Product.unscoped()
            .findAll({
                where: {
                    id: productsIds,
                },
                attributes: [
                    'id',
                    'name',
                    'slug',
                    'description',
                    'price',
                    'published',
                ],
                include: [
                    {
                        model: Database.getInstance().models.Review,
                        attributes: ['id', 'rate', 'content', 'createdAt'],
                        include: {
                            model: Database.getInstance().models.User,
                            attributes: ['id', 'firstName', 'lastName'],
                        },
                    },
                    {
                        attributes: [
                            'id',
                            'name',
                            'slug',
                            'description',
                            'published',
                            'promoted',
                        ],
                        model: Database.getInstance().models.Collection,
                    },
                ],
            })
    }
}
