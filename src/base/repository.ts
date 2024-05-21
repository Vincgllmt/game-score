import { Collection, OptionalUnlessRequiredId } from "mongodb";
import { mongodb } from "../services/mongodb";
import { BaseEntity } from "./entity";

export class Repository<Entity extends BaseEntity> {
    protected collection: Collection<Entity>

    public constructor(collectionName: string) {
        this.collection = mongodb.collection<Entity>(collectionName);
    }
    
    public async clear(): Promise<void> {
        await this.collection.deleteMany({});
    }

    public async insert(...data: Entity[]) {
        return await this.collection.insertMany(data as OptionalUnlessRequiredId<Entity>[]);
    }

    public async findAll() {
        return await this.collection.find().toArray();
    }

    public async populate(count: number, fixturesGenerator: (partialEntity?: Partial<Entity>) => Entity) : Promise<void> {
        await this.clear();
        const data = Array.from({ length: count }, () => fixturesGenerator());
        await this.insert(...data);
    }
}