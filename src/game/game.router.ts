import { GameController } from "./game.controller";
import { gameRepository } from "./game.repository";

const gameController = new GameController(gameRepository);
export default gameController.newRouter();