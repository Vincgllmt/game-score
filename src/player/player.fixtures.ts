import { faker } from "@faker-js/faker";
import { Player } from "./player";
            
export function createPlayer(partialData?: Partial<Player>): Player {
    return {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        tour: faker.datatype.boolean() ? 'ATP' : 'WTA',
        country: faker.location.country(),
        ...partialData
    }
}