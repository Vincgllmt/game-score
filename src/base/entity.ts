import { ObjectId } from "mongodb";

export interface BaseEntity extends Document {
    _id?: ObjectId
}