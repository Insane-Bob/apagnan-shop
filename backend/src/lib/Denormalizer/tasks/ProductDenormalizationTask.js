import { DenormalizerTask } from '../DenormalizerTask.js'
import { Database } from '../../../Models/index.js'
import {Schema} from 'mongoose'
export class ProductDenormalizationTask extends DenormalizerTask{
  static schema = new Schema({
    id:Number,
    slug:String,
    name: String,
    description: String,
    price: Number,
    published: Boolean,
    Reviews: [
      {
        rate: Number,
        content: String,
        User: {
          firstName: String,
          lastName: String
        },
      }
    ],
    Collection:{
      name: String,
      slug: String,
      description: String,
      published: Boolean,
      promoted: Boolean
    }
  });

  constructor() {
    super()
    this.in('products')
  }
  fetch(productsIds){
    return Database.getInstance().models.Product.findAll({
      where: {
        id: productsIds
      },
      attributes:['id',
        'name','slug','description','price', 'published'
      ],
      include:[
        {
          model: Database.getInstance().models.Review,
          attributes:['rate', 'content'],
          include: {
            model:Database.getInstance().models.User,
            attributes: ['firstName', 'lastName']
          }
        },
        {
          attributes:['name','slug','description','published','promoted'],
          model: Database.getInstance().models.Collection
        }
      ]
    })
  }
}