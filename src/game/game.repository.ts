import { Repository } from "../base/repository";
import { Game } from "./game";

export const gameRepository = new Repository<Game>("game");