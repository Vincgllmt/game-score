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

    async populate(count: number, fixturesGenerator: (partialEntity?: Partial<HelloData>) => HelloData) : Promise<void> {
        await this.clear();
        const data = Array.from({ length: count }, () => fixturesGenerator());
        await this.insert(...data);
    }
}

export const helloRepository = new HelloRepository();