import {Model} from "sequelize";

export class DenormalizableModel extends Model{
    static denormalizerTasks = new Map()

    static registerDenormalizerTask(builder){
        if(!this.denormalizerTasks.has(this.name)){
            this.denormalizerTasks.set(this.name,[])
        }
        let tasksArray = this.denormalizerTasks.get(this.name)
        tasksArray.push(builder.build())
        this.denormalizerTasks.set(this.name,tasksArray)
    }

    static getSelfDenormalizerTask(){
        return this.denormalizerTasks.get(this.name)
    }
}