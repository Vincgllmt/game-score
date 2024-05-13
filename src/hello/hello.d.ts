import { ObjectId } from "mongodb";
        
export interface HelloData {
    _id?: ObjectId;
    message: string;
}