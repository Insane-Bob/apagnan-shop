import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import process from "process";

async function loadModels() {
    const command = process.env.npm_lifecycle_event
    let pathDir;
    if(command == 'start'){
        pathDir = 'dist/Models/Mongo'
    }else{
        pathDir = 'src/Models/Mongo'
    }

    const mongooseSchemasDir = path.resolve(pathDir)
    const mongooseSchemas = {}
    const mongooseFiles = fs.readdirSync(mongooseSchemasDir)
    for (let modelFile of mongooseFiles) {
        if (modelFile.indexOf('.js') == -1) continue
        let script = await import(mongooseSchemasDir + '/' + modelFile)
        const model = script.default(mongoose)
        mongooseSchemas[model.modelName] = model
    }

    return mongooseSchemas
}

export default async function createMongoConnection(url = null) {
    let _url = url || process.env.MONGO_URI || null
    if (!_url) return null
    let mongoDB = await mongoose.connect(_url)
    const models = await loadModels()
    return { models, mongoDB }
}
