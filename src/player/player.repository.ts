import { Repository } from "../base/repository";
import { Player } from "./player";

export const playerRepository = new Repository<Player>("player");