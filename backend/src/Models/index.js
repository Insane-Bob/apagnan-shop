'use strict'
import { DenormalizerModelListener } from '../lib/Denormalizer/DenormalizerModelListener.js'
import { mockDatabase } from '../tests/databaseUtils.js'
import createSequelizeConnection from './sequelizeInit.js'
import createMongoConnection from './mongoInit.js'

export class Database {
    static initialized = false
    static instance = null
    sequelize = null
    mongoDB = null

    /**
     * @returns {Database}
     */
    static getInstance() {
        return Database._getInstance()
    }
    /**
     * @returns {Database}
     */
    static _getInstance() {
        if (!Database.instance) {
            throw new Error('Database is not initialized')
        }
        return Database.instance
    }

    static async initialize(url = null) {
        if (this.initialized) throw new Error('Database is already initialized')
        let sequelize = await createSequelizeConnection(url)
        let mongoDB = await createMongoConnection()

        this.instance = new Database(sequelize, mongoDB)
        this.initialized = true
    }
    static async close() {
        if (!this.initialized) throw new Error('Database is not initialized')
        if (Database.getInstance()?.sequelize)
            await Database.getInstance()?.sequelize?.close()

        if (Database.getInstance()?.mongoDB)
            await Database.getInstance()?.mongoDB.mongoDB.connections.forEach(
                (c) => c.close(),
            )
        this.initialized = false
        return true
    }

    static transaction() {
        return Database.getInstance().sequelize.transaction()
    }

    constructor(sequelize, mongoDB) {
        this.sequelize = sequelize
        this.mongoDB = mongoDB
        this.initializeDenormalizerListeners()
    }

    get models() {
        return this.sequelize.models
    }

    /**
     *
     * @returns {Object<string,Object>}
     */
    get mongoModels() {
        return this.mongoDB.models
    }

    initializeDenormalizerListeners() {
        for (let modelName in this.models) {
            this.models[modelName]._denormalizerListener =
                new DenormalizerModelListener(this.models[modelName])
        }
    }

    query(...args) {
        return this.sequelize.query(...args)
    }

    /**
     * Mocking
     */

    static mock() {
        mockDatabase(this)
    }

    static unmock() {
        if (!this.initialized) throw new Error('Database is not initialized')
        Database.getInstance = () => Database._getInstance()
    }
}
