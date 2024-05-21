import { Collection, Filter, ObjectId, OptionalUnlessRequiredId } from "mongodb";
import { mongodb } from "../services/mongodb";
import { BaseEntity } from "./entity";

export class Repository<TEntity extends BaseEntity> {
    protected collection: Collection<TEntity>

    public constructor(collectionName: string) {
        this.collection = mongodb.collection<TEntity>(collectionName);
    }
    
    public async clear(): Promise<void> {
        await this.collection.deleteMany({});
    }

    public async insert(...data: TEntity[]) {
        return await this.collection.insertMany(data as OptionalUnlessRequiredId<TEntity>[]);
    }

    public async findAll() {
        return await this.collection.find().toArray();
    }

    public async findById(id: string) {
        return await this.collection.findOne({ _id: new ObjectId(id) } as Filter<TEntity>);
    }

    public async deleteById(id: string) {
        return await this.collection.deleteOne({ _id: new ObjectId(id) } as Filter<TEntity>);
    }

    public async deleteOne(query: any) {
        return await this.collection.deleteOne(query);
    }

    public async populate(count: number, fixturesGenerator: (partialEntity?: Partial<TEntity>) => TEntity) : Promise<void> {
        await this.clear();
        const data = Array.from({ length: count }, () => fixturesGenerator());
        await this.insert(...data);
    }
}