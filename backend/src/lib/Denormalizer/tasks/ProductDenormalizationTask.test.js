/**
 * Ces tests permettent d'assurer la cohérence des données dénormalisées dans la collections Mongo
 * Mongo Collection : products
 */
import { useFreshDatabase } from '../../../tests/databaseUtils.js'
import { UserFactory } from '../../../database/factories/UserFactory.js'
import { ProductFactory } from '../../../database/factories/ProductFactory.js'
import { ReviewFactory } from '../../../database/factories/ReviewFactory.js'
import { DenormalizerQueue } from '../DenormalizerQueue.js'

let users;
let reviews = [];
let products = []
describe('ProductDenormalizationTask', () => {
  DenormalizerQueue.ignoreTest = false


  useFreshDatabase(async ()=>{
    let endPromise = new Promise((res,rej)=>{
      DenormalizerQueue.onEnd = ()=>{
        res()
      }
    })
    users = await UserFactory.count(3).create()
    products = await ProductFactory.count(5).create()
    for(let product in products){
      reviews.push(await ReviewFactory.count(3).create({productId: product.id,userId: users[0].id}))
      reviews.push(await ReviewFactory.count(3).create({productId: product.id,userId: users[1].id}))
      reviews.push(await ReviewFactory.count(3).create({productId: product.id,userId: users[2].id}))
    }

    await endPromise
    console.log("Fin de l'attente")
  })

  test('Product edition / creation', () => {

  })

  test('Review edition / creation', ()=>{

  })

  test('User edition / creation', () => {

  })

  test('Collection edition', () => {

  })


})