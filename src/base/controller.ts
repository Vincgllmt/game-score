import { validationResult } from "express-validator";
import { BaseEntity } from "./entity";
import { Repository } from "./repository";
import { Request, Response } from "express";

export class Controller<TEntity extends BaseEntity> {
    constructor(
        private readonly repository: Repository<TEntity> 
    ) {
    }

    async readAll(req: Request, res: Response) {
        res.send(await this.repository.findAll());
    }

    async create(req: Request, res: Response) {
        const result = validationResult(req);

        if (result.isEmpty()) {
            const data = req.body;
            await this.repository.insert(data);
            res.status(201).send(data);
        } else {
            res.status(400).send({ error: 'Invalid input' });
        }
    }
    async read(req: Request, res: Response) {
        const result = validationResult(req);

        if (result.isEmpty()) {
            const data = req.params;

            const result = await this.repository.findById(data.id);
            if (result) {
                res.send(result);
            }
            else {
                res.status(404).send({ error: 'Message non trouvé.' });
            }     
        }
        else {
            res.status(400).send({ error: 'Invalid input' });
        }
    }

    async delete(req: Request, res: Response) {
        const result = validationResult(req);

        if (result.isEmpty()) {
            const data = req.params;
            const result = await this.repository.deleteById(data.id);
            if (result.deletedCount) {
                res.status(204).send({ message: 'Message supprimé.' });
            }
            else {
                res.status(404).send({ error: 'Message non trouvé.' });
            }
        }
        else {
            res.status(400).send({ error: 'Invalid input' });
        }
    }
}