import setUpApp from '../../app.js'
import { useFreshDatabase } from '../../tests/databaseUtils.js'
import { ProductFactory } from '../../database/factories/ProductFactory.js'
import { ProductStockObserver } from '../../Observers/ProductStockObserver.js'
import { ProductController } from './ProductController.js'
import { Request } from '../../Core/Request.js'
let app = null
let product = null

describe('Product test routes', () => {
    useFreshDatabase()
    beforeEach(async () => {
        app = await setUpApp()
        product = await ProductFactory.withStock(10).create()
    })

    test('GET /api/products/:product/stock - stream stock', async () => {
        const observerInstance = ProductStockObserver.getInstance()

        const spySub = jest.spyOn(observerInstance, 'subscribe')
        const spyUnsub = jest.spyOn(observerInstance, 'unsubscribe')

        let req = new Request({
            params: {
                product: product.id,
            },
            query: {},
        })

        let callback = null

        let res = {
            writeHead: jest.fn(),
            write: jest.fn(),
            on: jest.fn((event, cb) => {
                callback = cb
            }),
            end: jest.fn(),
        }

        let controller = new ProductController(req, res)
        controller.product = product

        await controller.streamStock()
        expect(res.writeHead.mock.calls.length).toBe(1)
        expect(res.writeHead.mock.calls[0][1]).toHaveProperty(
            'Content-Type',
            'text/event-stream',
        )

        expect(res.write.mock.calls.length).toBe(1)
        expect(res.write.mock.calls[0][0]).toContain('' + product.stock)
        expect(res.on.mock.calls.length).toBe(1)
        expect(spySub).toHaveBeenCalled()

        product.stock = 30
        ProductStockObserver.getInstance().broadcast(product)

        expect(res.write.mock.calls.length).toBe(2)
        expect(res.write.mock.calls[1][0]).toContain('' + product.stock)

        callback() //simulate close connection
        expect(spyUnsub).toHaveBeenCalled()
        expect(res.end.mock.calls.length).toBe(1)
    })
})
