import { Repository } from "../base/repository";
import { HelloData } from "./hello";

export const helloRepository = new Repository<HelloData>("hello");