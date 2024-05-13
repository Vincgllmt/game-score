import { MongoClient } from "mongodb";
    
const uri = `mongodb://${process.env.username}:${process.env.password}@localhost:27017`;

export const mongoClient = new MongoClient(uri);
    
export const mongodb = mongoClient.db(process.env.db);