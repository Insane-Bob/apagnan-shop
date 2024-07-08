import request from 'supertest'
import setUpApp from '../../app.js'
import { Database } from '../../Models/index.js'
import { actingAs } from '../../tests/authTestUtils.js'
import { USER_ROLES } from '../../Models/user.js'

let app = null
describe('UserController test routes', () => {
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

    //useFreshDatabase()
    beforeEach(async () => {
        app = await setUpApp()
        Database.mock()
    })

    test('GET /api/collections - user access collections index', async () => {
        loginAsUser()
        await testRequest('/api/collections', 'get', 200)
    })

    test('GET /api/collections - admin access collections index', async () => {
        loginAsAdmin()
        await testRequest('/api/collections', 'get', 200)
    })

    test('GET /api/collection/:id - user can access one collection', async () => {
        loginAsUser()
        await testRequest('/api/collections/1', 'get', 200)
    })

    test('GET /api/collection/:id - admin can access one collection', async () => {
        loginAsAdmin()
        await testRequest('/api/collections/1', 'get', 200)
    })

    test('PUT /api/collections/:id - no update user', async () => {
        loginAsUser()
        await testRequest('/api/collections/1', 'patch', 403)
    })

    test('PUT /api/collections/:id - admin can update', async () => {
        loginAsAdmin()
        await testRequest(
            '/api/collections/1',
            'patch',
            200,
            (req) => {
                return req.send({
                    name: 'Test',
                })
            },
            (response) => {
                console.log(response.body)
                expect(response.body.collection.name).toBe('Test')
            },
        )
    })

    // test('DELETE /api/users/:id - no delete user', async () => {
    //     loginAsUser()
    //     await testRequest('/api/users/2', 'delete', 403)
    //     await testRequest('/api/users/1', 'delete', 200)
    // })

    // test('GET /api/users/:id - admin access user', async () => {
    //     loginAsAdmin()
    //     await testRequest('/api/users/2', 'get', 200)
    // })

    // test('PUT /api/users/:id - admin update user', async () => {
    //     loginAsAdmin()
    //     await testRequest(
    //         '/api/users/2',
    //         'put',
    //         200,
    //         (req) => {
    //             return req.send({
    //                 firstName: 'Test',
    //                 lastName: 'User',
    //             })
    //         },
    //         (response) => {
    //             expect(response.body.firstName).toBe('Test')
    //             expect(response.body.lastName).toBe('User')
    //         },
    //     )
    // })

    // test('DELETE /api/users/:id - admin delete user', async () => {
    //     loginAsAdmin()
    //     await testRequest('/api/users/2', 'delete', 200)
    // })
})
