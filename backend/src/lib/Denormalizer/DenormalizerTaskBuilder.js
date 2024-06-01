import {DenormalizerTask} from "./DenormalizerTask.js";

export class DenormalizerTaskBuilder{
    constructor(){
        this.arguments = Array(3).fill(undefined)
    }

    static create(){
        return new DenormalizerTaskBuilder()
    }

    in(mongoCollection){
        this.arguments[0] = mongoCollection
        return this
    }
    to(documentStructure){
        this.arguments[1] = documentStructure
        return this
    }
    fetchFrom(fetchingMethod){
        this.arguments[2] = fetchingMethod
        return this
    }

    build(){
        return new DenormalizerTask(...this.arguments)
    }
}