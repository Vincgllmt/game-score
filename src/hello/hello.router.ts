import { HelloController } from "./hello.controller";
import { helloRepository } from "./hello.repository";

const helloController = new HelloController(helloRepository);
export default helloController.newRouter();