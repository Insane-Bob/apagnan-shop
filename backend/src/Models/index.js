'use strict'
import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'
import process from 'process'
import { mockDatabase } from '../tests/databaseUtils.js'
import mongoose from 'mongoose'
import { DenormalizerModelListener } from '../lib/Denormalizer/DenormalizerModelListener.js'

async function initDatabase(url) {
    // eslint-disable-next-line no-undef
    const __MODEL_DIR__ = path.resolve('src/Models/')
    const basename = path.basename(__MODEL_DIR__ + '/index.js')
    const env = process.env.NODE_ENV || 'development'
    const config = JSON.parse(
        fs.readFileSync(path.resolve('config/config.json')),
    )[env]
    const db = {}
    let sequelize

    if (url) {
        sequelize = new Sequelize(url)
        sequelize.options.logging = false
    } else {
        if (config?.use_env_variable) {
            sequelize = new Sequelize(
                process.env[config.use_env_variable],
                config,
            )
        } else {
            sequelize = new Sequelize(
                config.database,
                config.username,
                config.password,
                config,
            )
        }
    }

    const tasks = fs
        .readdirSync(__MODEL_DIR__)
        .filter((file) => {
            return (
                file.indexOf('.') !== 0 &&
                file !== basename &&
                file.slice(-3) === '.js' &&
                file.indexOf('.test.js') === -1
            )
        })
        .map(async (file) => {
            const script = await import('./' + file)
            const model = script.default(sequelize, Sequelize)
            db[model.name] = model
        })
    await Promise.all(tasks)

    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db)
        }
        if (db[modelName].hooks) {
            db[modelName].hooks(db)
        }
        if (db[modelName].addScopes) {
            db[modelName].addScopes(db)
        }
    })

    db.sequelize = sequelize
    globalThis.db = db
    return db
}

export class Database {
    static instance = null
    static initialized = false
    constructor(sequelize) {
        this.sequelize = sequelize
        this.mongoDB = process.env.MONGO_URI
            ? mongoose.createConnection(process.env.MONGO_URI)
            : null
        this.initializeDenormalizerListeners()
    }

    initializeDenormalizerListeners() {
        for (let modelName in this.models) {
            this.models[modelName]._denormalizerListener =
                new DenormalizerModelListener(this.models[modelName])
        }
    }

    static mock() {
        mockDatabase(this)
    }

    static unmock() {
        if (!this.initialized) throw new Error('Database is not initialized')
        Database.getInstance = () => Database._getInstance()
    }

    static async initialize(url) {
        if (this.initialized) throw new Error('Database is already initialized')
        console.time('Database initialized')
        await initDatabase(url)
        this.getInstance()
        console.timeEnd('Database initialized')
        this.initialized = true
        return true
    }

    static async close() {
        if (!this.initialized) throw new Error('Database is not initialized')
        if (Database.getInstance()?.sequelize)
            await Database.getInstance()?.sequelize?.close()
        if (Database.getInstance()?.mongoDB)
            await Database.getInstance()?.mongoDB.close()
        this.initialized = false
        return true
    }

    /**
     * @returns {Database}
     */
    static getInstance() {
        return Database._getInstance()
    }

    static transaction() {
        return Database.getInstance().sequelize.transaction()
    }

    query(...args) {
        return this.sequelize.query(...args)
    }

    /**
     * @returns {Database}
     */
    static _getInstance() {
        if (!Database.instance) {
            Database.instance = new Database(globalThis?.db?.sequelize)
        }
        return Database.instance
    }

    get models() {
        return this.sequelize.models
    }

    mongoModel(collectionName, schema) {
        //check if the model already exists
        if (this.mongoDB.models[collectionName]) {
            return this.mongoDB.models[collectionName]
        }

        return this.mongoDB.model(collectionName, schema)
    }
}
