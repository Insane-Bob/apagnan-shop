import setUpApp from '../../app.js'
import { useFreshDatabase } from '../../tests/databaseUtils.js'
import { ProductFactory } from '../../database/factories/ProductFactory.js'
import { ProductStockObserver } from '../../Observers/ProductStockObserver.js'
import { ProductController } from './ProductController.js'
import { Request } from '../../Core/Request.js'
let app = null
let product = null

describe('Product test routes', () => {
    let userTemplate = {
        id: 1,
        firstName: 'Test',
        lastName: 'User',
        email: 'userController@email.com',
    }

    function loginAsAdmin() {
        actingAs({
            ...userTemplate,
            role: USER_ROLES.ADMIN,
        })
    }

    function loginAsUser() {
        actingAs({
            ...userTemplate,
            role: USER_ROLES.USER,
        })
    }

    async function testRequest(
        route,
        method,
        expectCode,
        customRequest = (request) => request,
        customExpect = (response) => response,
    ) {
        const req = request(app)
            [method](route)
            .set('Accept', 'application/json')
        const response = await customRequest(req)
        expect(response.statusCode).toBe(expectCode)
        return customExpect(response)
    }

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

    test('GET /api/products - get all products', async () => {
        loginAsUser()
        await testRequest('/api/products', 'get', 200)
    })

    test('GET /api/products/:product - get one product', async () => {
        loginAsUser()
        await testRequest(`/api/products/${product.id}`, 'get', 200)
    })

    test('POST /api/products - create a product', async () => {
        loginAsAdmin()
        await testRequest(
            '/api/products',
            'post',
            201,
            (req) => {
                return req.send({
                    name: 'Product Test',
                    price: 10,
                    stock: 10,
                    description: 'Product Test Description',
                    collectionId: product.collectionId,
                })
            },
            (response) => {
                expect(response.body.product.name).toBe('Product Test')
                expect(response.body.product.price).toBe(10)
                expect(response.body.product.stock).toBe(10)
                expect(response.body.product.description).toBe(
                    'Product Test Description',
                )
            },
        )
    })

    test('PATCH /api/products/:product - update a product', async () => {
        loginAsAdmin()
        await testRequest(
            `/api/products/${product.id}`,
            'patch',
            200,
            (req) => {
                return req.send({
                    name: 'Product Test Updated',
                    price: 10,
                    stock: 10,
                    description: 'Product Test Description Updated',
                    collectionId: product.collectionId,
                })
            },
            (response) => {
                expect(response.body.product.name).toBe('Product Test Updated')
                expect(response.body.product.price).toBe(10)
                expect(response.body.product.stock).toBe(10)
                expect(response.body.product.description).toBe(
                    'Product Test Description Updated',
                )
            },
        )
    })

    test('DELETE /api/products/:product - delete a product', async () => {
        let productTobeDeleted = ProductFactory.withStock(10).create()
        loginAsAdmin()
        await testRequest(
            `/api/products/${productTobeDeleted.id}`,
            'delete',
            204,
        )
    })
})
