import { ObjectId } from "mongodb";
        
export interface HelloData extends BaseEntity {
    message: string;
}