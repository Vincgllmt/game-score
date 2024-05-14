import { Collection } from "mongodb";
import { mongodb } from "../services/mongodb";
import { HelloData } from "./hello";
        
export const helloCollection = mongodb.collection<HelloData>('hello');

export class HelloRepository {
    async clear() {
        return await helloCollection.deleteMany({});
    }

    async insert(...data: HelloData[]) {
        return await helloCollection.insertMany(data);
    }
    
    async findAll() {
        return await helloCollection.find().toArray();
    }
}

export const helloRepository = new HelloRepository();