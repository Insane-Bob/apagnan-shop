import {Database} from "../Models/index.js";
import {spawnSync} from "child_process";


export function useFreshDatabase(beforeAllCallback = async ()=>(null), afterAllCallback = async ()=>(null)){
    beforeAll(async()=>{
        await runMigration()
        await Database.initialize()
        await beforeAllCallback()
    }, 30000)

    afterAll(async()=> {
        await afterAllCallback()
        await Database.close()
        await undoAllMigration()
    }, 30000)
}
export function runMigration(){
    console.log("Running database migration")
    spawnSync("npx", ["sequelize-cli", "db:migrate"])
}
export function undoAllMigration(){
    console.log("Undoing all database migration")
    spawnSync("npx", ["sequelize-cli", "db:migrate:undo:all"])
}
export function mockDatabase(databaseClass){
    if(process.env.NODE_ENV !== "test") throw new Error("Cannot mock database outside of test environment")
    databaseClass.getInstance = jest.fn(()=>( {
        models: {
            User: {
                findOne: jest.fn(),
                create: jest.fn((obj) => obj),
            },
            Token: {
                findOne: jest.fn(),
                create: jest.fn((obj) => obj),
            }
        }
    }))
}

export async function emptyTables(){
    for(let model in Database.getInstance().models){
        await Database.getInstance().models[model]?.destroy({where: {}})
    }
}