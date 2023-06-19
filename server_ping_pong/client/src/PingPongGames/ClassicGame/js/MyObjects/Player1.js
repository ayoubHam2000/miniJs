import { params } from "../Utils/Params";
import { Paddle } from "./Paddle";

export class Player1 extends Paddle {
    constructor(game) {
        super(game)

        this.position.set(-params.sceneDim.x / 2 + params.paddleDim.x / 2, 0, 0)
        this.setPos(this.position)
    }

    update() {
        this.setPos(this.position, params.event.x)
    }
}