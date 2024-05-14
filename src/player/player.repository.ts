import { Player } from "./player";
import { playerCollection } from "./player.collection";

export class PlayerRepository {
    async clear() {
        return await playerCollection.deleteMany({});
    }

    async insert(...data: Player[]) {
        return await playerCollection.insertMany(data);
    }

    async findAll() {
        return await playerCollection.find().toArray();
    }

    async populate(count: number, fixturesGenerator: (partialEntity?: Partial<Player>) => Player) : Promise<void> {
        await this.clear();
        const data = Array.from({ length: count }, () => fixturesGenerator());
        await this.insert(...data);
    }
}
export const playerRepository = new PlayerRepository();