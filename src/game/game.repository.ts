import { Game } from "./game";
import { gameCollection } from "./game.collection";

export class GameRepository {
    async clear() {
        return await gameCollection.deleteMany({});
    }

    async insert(...data: Game[]) {
        return await gameCollection.insertMany(data);
    }

    async findAll() {
        return await gameCollection.find().toArray();
    }

    async populate(count: number, fixturesGenerator: (partialEntity?: Partial<Game>) => Game) : Promise<void> {
        await this.clear();
        const data = Array.from({ length: count }, () => fixturesGenerator());
        await this.insert(...data);
    }
}

export const gameRepository = new GameRepository();