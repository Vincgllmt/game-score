import { Collection } from "mongodb";
import { mongodb } from "../services/mongodb";
import { HelloData } from "./hello";
        
export const helloCollection = mongodb.collection<HelloData>('hello');