import * as THREE from 'three'
import { params } from '../Utils/Params'

export class Player2 extends THREE.Object3D {
    
    constructor (game) {
        super()

        //common
        this.game = game
        this.scene = game.scene
        this.camera = game.camera
        this.ballObj = this.scene.ballObj
        this.velocity = new THREE.Vector3()
        this.timeStep = params.timeStep
        this.botTarget = new THREE.Vector3(0, 0, 0)
        this.moveToInfo = {
            status : 0,
            lose : false
        }
        const racket =  this.getObject()
        this.racketModel = racket.racketModel
        this.racketParent = racket.racketParent
        this.add(this.racketParent)
        this.scene.add(this)

        this.socketData = undefined
    }

    getObject() {
        const racketModel = this.scene.racketModel.clone()
        racketModel.scale.set(0.15, 0.15, 0.3)
        racketModel.rotation.y = - Math.PI / 2

        const racketParent = new THREE.Group()
        racketParent.add(racketModel)

        racketModel.position.y = -1.5
        racketParent.position.set(0, 2.5, 0)

       
        this.position.set(-18, 0, 0)
        return {
            racketModel,
            racketParent
        }
        
    }

    rotateObj() {
        //racket rotation
        let b = (this.position.z / params.planeDim.y * 2 + 1) * 0.5
        const newAngle =  Math.PI * 1.5 * (b * 2 - 1)
        if (newAngle > - Math.PI / 2 && newAngle < Math.PI / 2){
            this.racketParent.rotation.x = newAngle
        }
    }

    socketMoveRacket(data) {
        this.position.copy(data.position)
        this.rotateObj()
    }

    update() {
        
    }
}