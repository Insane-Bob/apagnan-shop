import { Database } from '../Models/index.js'
import { spawnSync } from 'child_process'
import crypto from 'crypto'
import mongoose from 'mongoose'

const isGithubAction = process.env.CI === 'true'

function databseLog(...args) {
    if (isGithubAction) return
    console.log(...args)
}

export function useFreshMongoDatabase(deleteAfter = true) {
    const uniqueId = crypto.randomBytes(4).toString('hex')
    process.env.MONGO_URI = process.env.MONGO_URI.replace(
        /\/mongo$/,
        '/test_' + uniqueId,
    )

    databseLog('Using mongo test database (' + process.env.MONGO_URI + ')')
    afterAll(async () => {
        if (!deleteAfter) return
        databseLog('Delete mongo test database (' + process.env.MONGO_URI + ')')
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
    })
}

export function useFreshDatabase(
    beforeAllCallback = async () => null,
    afterAllCallback = async () => null,
) {
    const uniqueId = crypto.randomBytes(4).toString('hex')
    const url = 'postgres://postgres:postgres@db:5432/test_postgres_' + uniqueId
    beforeAll(async () => {
        await createTestDatabase(url)
        await Database.initialize(url)
        try {
            await beforeAllCallback()
        } catch (e) {
            console.error(e)
            throw e
        }
    }, 30000)

    afterAll(async () => {
        try {
            await afterAllCallback()
        } catch (e) {
            console.error(e)
            throw e
        }
        await Database.close()
        await deleteTestDatabase(url)
    }, 30000)
}

export function createTestDatabase(url) {
    databseLog('Creating test database (' + url + ')')
    let response

    response = spawnSync('npx', ['sequelize-cli', 'db:create', '--url', url])
    if (response.status !== 0) {
        console.error(response.stderr.toString())
        throw new Error('Failed to create test database')
    }

    response = spawnSync('npx', ['sequelize-cli', 'db:migrate', '--url', url])
    if (response.status !== 0) {
        console.error(response.stderr.toString())
        throw new Error('Failed to migrate test database')
    }
}
function deleteTestDatabase(url) {
    databseLog('delete test database (' + url + ')')
    let response = spawnSync('npx', ['sequelize-cli', 'db:drop', '--url', url])
    if (response.status !== 0) {
        console.error(response.stderr.toString())
        throw new Error('Failed to drop test database')
    }
}
export function getModelMock() {
    class MockedModel {
        constructor(obj) {
            Object.assign(this, obj)
        }

        static findOne = jest.fn(() => new MockedModel({ id: 1 }))
        static create = jest.fn((obj) => new MockedModel(obj))
        static destroy = jest.fn()
        static findAll = jest.fn(() =>
            Array(4)
                .fill(0)
                .map((_, i) => new MockedModel({ id: i })),
        )
        static findByPk = jest.fn((id) => new MockedModel({ id }))

        destroy() {
            return true
        }
        update(obj) {
            Object.assign(this, obj)
            return this
        }
        save() {
            return this
        }
    }
    return MockedModel
}

export function mockDatabase(databaseClass) {
    if (process.env.NODE_ENV !== 'test')
        throw new Error('Cannot mock database outside of test environment')
    databaseClass.getInstance = jest.fn(() => ({
        models: {
            User: getModelMock(),
            Token: getModelMock(),
            Customer: getModelMock(),
            Product: getModelMock(),
            Order: getModelMock(),
            OrderItem: getModelMock(),
            UserBasket: getModelMock(),
            Collection: getModelMock(),
            Upload: getModelMock(),
            Address: getModelMock(),
            AccessLink: getModelMock(),
        },
    }))
}

export async function emptyTables() {
    for (let model in Database.getInstance().models) {
        await Database.getInstance().models[model]?.destroy({ where: {} })
    }
}
