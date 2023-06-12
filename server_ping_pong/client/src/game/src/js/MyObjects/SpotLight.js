import * as THREE from "three";
import { params } from '../Utils/Params'

export class SpotLight extends THREE.SpotLight {

    constructor(game) {
        super(0xffffff)

        this.game = game
        this.scene = game.scene





        this.position.set(3, 15, 0)
        this.penumbra = params.penumbra
        this.angle = params.angle
        this.intensity = params.intensity
        this.castShadow = true

        this.scene.add(this)
    }


    

}