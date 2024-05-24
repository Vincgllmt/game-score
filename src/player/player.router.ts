import { PlayerController } from "./player.controller";
import { playerRepository } from "./player.repository";

const playerController = new PlayerController(playerRepository);
export default playerController.newRouter();