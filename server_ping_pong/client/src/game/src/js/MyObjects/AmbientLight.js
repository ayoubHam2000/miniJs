import * as THREE from "three";
import { params } from '../Utils/Params'

export class AmbientLight extends THREE.AmbientLight {

    constructor(game) {
        super(0xcccccc, params.ambientLightIntensity)

        this.game = game
        this.scene = game.scene

      

        this.scene.add(this)
    }


}
