import { Database } from '../Models/index.js'
import { spawnSync } from 'child_process'
import Sequelize from 'sequelize'

export function useFreshDatabase(
    beforeAllCallback = async () => null,
    afterAllCallback = async () => null,
) {
    beforeAll(async () => {
        await undoAllMigration()
        await runMigration()
        await Database.initialize()
        await beforeAllCallback()
    }, 30000)

    afterAll(async () => {
        await afterAllCallback()
        await Database.close()
        //await undoAllMigration()
    }, 30000)
}
export function runMigration() {
    console.log('Running database migration')
    spawnSync('npx', ['sequelize-cli', 'db:migrate'])
}
export function undoAllMigration() {
    console.log('Undoing all database migration')
    let response= null
    response = spawnSync('npx', ['sequelize-cli', 'db:drop'])
    if(response.status !== 0) throw  new Error('Failed to drop database')
    response = spawnSync('npx', ['sequelize-cli', 'db:create'])
    if(response.status !== 0) throw  new Error('Failed to create database')
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
        },
    }))
}

export async function emptyTables() {
    for (let model in Database.getInstance().models) {
        await Database.getInstance().models[model]?.destroy({ where: {} })
    }
}
