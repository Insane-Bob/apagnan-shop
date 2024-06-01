import {Database} from "../../Models/index.js";

export class DenormalizerTask{
    constructor(collection, documentStructure, fetchingMethod = null)
    {
        this.collectionString = collection;
        this.documentStructureClass = documentStructure;
        this.fetchingMethod = fetchingMethod;
        this.targetedInstance = null;
    }

    async fetch(fromInstance){
        this.targetedInstance = this.fetchingMethod ? await this.fetchingMethod(fromInstance) : fromInstance
    }

    async execute(instance){
        console.time("DenormalizerTask executed in : ")
        await this.fetch(instance)

        if(!this.targetedInstance) throw new Error("Targeted instance is not defined")
        if(!this.collectionString) throw new Error("Collection is not defined")

        let mongoCollection = Database.getInstance().mongoDB.collection(this.collectionString)
        const document = await this.documentStructureClass.loadFromInstance(this.targetedInstance)

        const exist = await mongoCollection.findOne({id: document.id})
        if(exist) await mongoCollection.replaceOne({id: document.id}, await document.format());
        else await mongoCollection.insertOne(await document.format())

        console.timeEnd("DenormalizerTask executed in : ")
    }
}