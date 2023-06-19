import * as THREE from 'three'
import {params} from '../Utils/Params'

export class Paddle extends THREE.Object3D {
    constructor(game) {
        super()

        this.game = game
        this.scene = game.scene
        this.speed = 4
        this.addedSpeed = 0
        this.maxAdd = 12
        this.dir = 0
        this.timeStep = params.timeStep

        const objs = this.getRacketObj()
        this.add(objs)
        this.scene.add(this)


        
    }

    getRacketObj() {
        const geo = new THREE.PlaneGeometry(params.paddleDim.x, params.paddleDim.y - params.ballDim)
        const mat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide
        })
        const mesh = new THREE.Mesh(geo, mat)

        return (mesh)
    }


    setPosHelper(pos) {
        this.cx = pos.x
        this.x1 = pos.x - params.paddleDim.x / 2
        this.x2 = pos.x + params.paddleDim.x / 2
        this.cy = pos.y
        this.y1 = pos.y + params.paddleDim.y / 2
        this.y2 = pos.y - params.paddleDim.y / 2
    }


    receivePos(data) {
        this.position.y = data.y
        this.setPosHelper(this.position)
    }


}
