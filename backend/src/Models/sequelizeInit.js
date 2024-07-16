import path from 'path'
import Sequelize from 'sequelize'
import process from 'process'
import fs from 'fs'

export async function loadSQLModels(sequelize) {
    const command = process.env.npm_lifecycle_event
    let pathDir;
    if(command == 'start'){
        pathDir = 'dist/Models/SQL'
    }else{
        pathDir = 'src/Models/SQL'
    }

    const SQLDirPath = path.resolve(pathDir)

    const SQLModels = {}
    const SQLFiles = fs.readdirSync(SQLDirPath)

    for (let modelFile of SQLFiles) {
        if (modelFile.indexOf('.js') == -1) continue
        let script = await import(SQLDirPath + '/' + modelFile)
        const model = script.default(sequelize, Sequelize)
        SQLModels[model.name] = model
    }

    Object.keys(SQLModels).forEach((modelName) => {
        if (SQLModels[modelName].associate) {
            SQLModels[modelName].associate(SQLModels)
        }
        if (SQLModels[modelName].hooks) {
            SQLModels[modelName].hooks(SQLModels)
        }
        if (SQLModels[modelName].addScopes) {
            SQLModels[modelName].addScopes(SQLModels)
        }
    })

    return SQLModels
}

export default async function createSequelizeConnection(url) {
    const env = process.env.NODE_ENV || 'development'
    const config = JSON.parse(
        fs.readFileSync(path.resolve('config/config.json')),
    )[env]

    let sequelize
    if (url) {
        sequelize = new Sequelize(url)
        sequelize.options.logging = false
    } else {
        sequelize = new Sequelize(
            config.database,
            config.username,
            config.password,
            config,
        )
    }

    await loadSQLModels(sequelize)

    return sequelize
}
