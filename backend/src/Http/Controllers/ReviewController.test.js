import request from 'supertest'
import setUpApp from '../../app.js'
import { Database } from '../../Models/index.js'
import { actingAs } from '../../tests/authTestUtils.js'
import { USER_ROLES } from '../../Models/SQL/user.js'

let app = null
describe('ReviewController test routes', () => {
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

    test('GET /api/reviews - user access reviews index', async () => {
        loginAsUser()
        await testRequest('/api/reviews', 'get', 200)
    })

    test('GET /api/reviews - admin access reviews index', async () => {
        loginAsAdmin()
        await testRequest('/api/reviews', 'get', 200)
    })

    test('GET /api/review/:id - user can access one review', async () => {
        loginAsUser()
        await testRequest('/api/reviews/1', 'get', 200)
    })

    test('GET /api/review/:id - admin can access one review', async () => {
        loginAsAdmin()
        await testRequest('/api/reviews/1', 'get', 200)
    })

    test('POST /api/reviews/:id - no creation from user', async () => {
        loginAsUser()
        await testRequest('/api/reviews', 'post', 403)
    })

    test('POST /api/reviews - creation from admin', async () => {
        loginAsAdmin()
        await testRequest(
            '/api/reviews',
            'post',
            200,
            (req) => {
                return req.send({
                    rate: 2,
                    content: 'Review Test',
                })
            },
            (response) => {
                expect(response.body.review.content).toBe('Review Test')
                expect(response.body.review.rate).toBe(2)
                expect(response.body.review.userId).toBe(1)
                expect(response.body.review.approved).toBe(false)
            },
        )
    })

    test('PATCH /api/reviews/:id - no update user', async () => {
        loginAsUser()
        await testRequest('/api/reviews/1', 'patch', 403)
    })

    test('PATCH /api/reviews/:id - admin can update', async () => {
        loginAsAdmin()
        await testRequest(
            '/api/reviews/1',
            'patch',
            200,
            (req) => {
                return req.send({
                    approved: true,
                })
            },
            (response) => {
                expect(response.body.review.approved).toBe(true)
            },
        )
    })

    test('DELETE /api/reviews/:id - no delete user', async () => {
        loginAsUser()
        await testRequest('/api/reviews/1', 'delete', 403)
    })

    test('DELETE /api/reviews/:id - no delete user', async () => {
        loginAsAdmin()
        await testRequest('/api/reviews/1', 'delete', 200)
    })
})
