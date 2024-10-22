import request from 'supertest'
import setUpApp from '../../app.js'
import { Database } from '../../Models/index.js'
import { actingAs } from '../../tests/authTestUtils.js'
import { USER_ROLES } from '../../Models/SQL/user.js'
import { UserPersonalInformationService } from '../../Services/UserPersonalInformationService.js'

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

    test('GET /api/users - no access users index', async () => {
        loginAsUser()
        await testRequest('/api/users', 'get', 403)
    })

    test('GET /api/users - admin access users index', async () => {
        loginAsAdmin()
        await testRequest('/api/users', 'get', 200)
    })

    test('GET /api/users/:id - no admin user access user', async () => {
        loginAsUser()
        await testRequest('/api/users/2', 'get', 403)
        await testRequest('/api/users/1', 'get', 200)
    })

    test('PATCH /api/users/:id - no update user', async () => {
        loginAsUser()
        await testRequest('/api/users/2', 'patch', 403)
        await testRequest(
            '/api/users/1',
            'patch',
            200,
            (req) => {
                return req.send({
                    firstName: 'Test',
                    lastName: 'User',
                })
            },
            (response) => {
                expect(response.body.firstName).toBe('Test')
                expect(response.body.lastName).toBe('User')
            },
        )
    })

    test('DELETE /api/users/:id - no delete user', async () => {
        let commit = jest.fn()
        let rollback = jest.fn()
        Database.transaction = jest.fn(() => ({
            commit,
            rollback,
        }))
        UserPersonalInformationService.anonymizeUserPersonalInformation =
            jest.fn()
        loginAsUser()
        await testRequest('/api/users/2', 'delete', 403)
        await testRequest('/api/users/1', 'delete', 200)
        expect(
            UserPersonalInformationService.anonymizeUserPersonalInformation,
        ).toHaveBeenCalled()
        expect(Database.transaction).toHaveBeenCalled()
        expect(commit).toHaveBeenCalled()
        expect(rollback).not.toHaveBeenCalled()
    })

    test('GET /api/users/:id - admin access user', async () => {
        loginAsAdmin()
        await testRequest('/api/users/2', 'get', 200)
    })

    test('PATCH /api/users/:id - admin update user', async () => {
        loginAsAdmin()
        await testRequest(
            '/api/users/2',
            'patch',
            200,
            (req) => {
                return req.send({
                    firstName: 'Test',
                    lastName: 'User',
                })
            },
            (response) => {
                expect(response.body.firstName).toBe('Test')
                expect(response.body.lastName).toBe('User')
            },
        )
    })

    test('DELETE /api/users/:id - admin delete user', async () => {
        loginAsAdmin()
        await testRequest('/api/users/2', 'delete', 200)
    })

    test("POST /ask-login-as/:user_resource - user can't access ", async () => {
        loginAsUser()
        await testRequest('/api/users/ask-login-as/1', 'post', 403)
    })

    test('POST /ask-login-as/:user_resource - admin can access ', async () => {
        loginAsAdmin()
        await testRequest('/api/users/ask-login-as/1', 'post', 200)
    })
})
