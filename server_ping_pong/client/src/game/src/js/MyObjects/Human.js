import * as THREE from 'three'
import { params } from '../Utils/Params'
import { Player2 } from './Player2'

export class Human extends Player2 {

    constructor (game) {
        super(game)
        
        this.socketData = undefined
    }

    //===================================================

    socketReceive(data) {
        console.log("bot received ", data)
        this.socketData = data
    }

    socketMoveRacket(data) {
        this.position.copy(data.position)
        this.rotateObj()
    }

    //===================================================

    ballInit() {
        this.game.changeTurn(1)
        this.ballObj.position.x = - params.planeDim.x / 2
        this.ballObj.position.z = this.position.z
        this.ballObj.position.y = 3
    }

    update() {
        if (this.ballObj.initialize && !this.socketData && this.game.getTurnInit() === 1) {
            this.ballInit()
        }
        if (this.socketData) {
            //this.botTarget.copy(this.socketData.position)
            //console.log(this.botTarget, this.position)
            //let arrivedToTarget = this.player2MoveTo(0.05)
            //if (arrivedToTarget) {
                this.position.copy(this.socketData.position)
                this.position.y -= 2
                this.position.x -= 1
                this.ballObj.position.copy(this.socketData.position)
                let v = this.socketData.velocity
                this.ballObj.directSetVelocity(v.x, v.y, v.z)
                this.socketData = undefined
            //}
        } else {
            this.moveToInfo.status = 1
        }
    }

}