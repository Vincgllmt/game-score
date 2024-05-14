import { faker } from "@faker-js/faker";
import { HelloData } from "./hello";
            
export function createHelloData(partialData?: Partial<HelloData>): HelloData {
    return {
        message: partialData?.message ?? faker.lorem.sentence(),
    }
}