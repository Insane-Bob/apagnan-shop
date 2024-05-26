'use strict';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import process from 'process';
import {mockDatabase} from "../tests/databaseUtils.js";

;

async function initDatabase(){
  // eslint-disable-next-line no-undef
  const __MODEL_DIR__ = path.resolve("src/Models/")
  const basename = path.basename(__MODEL_DIR__ + "/index.js");
  const env = process.env.NODE_ENV || 'development';
  const config = JSON.parse(fs.readFileSync(path.resolve("config/config.json")))[env]
  const db = {};
  let sequelize;
  if (config?.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }

  const tasks = fs
      .readdirSync(__MODEL_DIR__)
      .filter(file => {
        return (
            file.indexOf('.') !== 0 &&
            file !== basename &&
            file.slice(-3) === '.js' &&
            file.indexOf('.test.js') === -1
        );
      })
      .map(async file => {
        const script = await import("./"+file)
        const model = script.default(sequelize, Sequelize)
        db[model.name] = model;
      });
  await Promise.all(tasks)

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  globalThis.db = db
  return db
}


export class Database{
    static instance  = null
    static initialized = false
    constructor(sequelize, Sequelize){
        this.sequelize = sequelize
        this.Sequelize = Sequelize
    }

    static mock(){
        mockDatabase(this)
    }

    static unmock(){
        if(!this.initialized) throw new Error("Database is not initialized")
        Database.getInstance = ()=> Database._getInstance()
    }

    static async initialize(){
        if(this.initialized) throw new Error("Database is already initialized")
        await initDatabase()
        console.log("Database initialized")
        this.initialized = true
        return true
    }

    static async close(){
        if(!this.initialized) throw new Error("Database is not initialized")
        await Database.getInstance().sequelize.close()
        this.initialized = false
        return true
    }

    static getInstance(){
        return Database._getInstance()
    }

    static _getInstance(){
        if(!Database.instance){
            Database.instance = new Database(globalThis?.db?.sequelize, globalThis?.db?.Sequelize)
        }
        return Database.instance
    }

    get models(){
        return this.sequelize.models
    }
}


