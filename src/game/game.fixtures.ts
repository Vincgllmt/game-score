import { faker } from "@faker-js/faker";
import { Game } from "./game";
import { createPlayer } from "../player/player.fixtures";
            
export function createGame(partialData?: Partial<Game>): Game {
    return {
        players: {
            player1: createPlayer(),
            player2: createPlayer()
        },
        config: {
            tour: faker.datatype.boolean() ? 'ATP' : 'WTA',
            sets: faker.number.int({ min: 2, max: 5 }),
        },
        state: {
            currentSet: 0,
            tieBreak: false,
            scores: [
                { sets: 0, games: [], points: 0 },
                { sets: 0, games: [], points: 0 }
            ],
            winner: undefined
        },
        ...partialData
    }
}