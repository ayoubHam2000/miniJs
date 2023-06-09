import * as THREE from "three";
import { params } from "../Utils/Params";


export class MyCamera extends THREE.PerspectiveCamera {
    
    constructor(x = 0, y = 0, z = 0) {
        super(45,
            window.innerWidth / window.innerHeight,
            0.01,
            1000)

        this.cameraMovement = {
            speed: Math.PI / 3,
            r : params.vectorPos1.x,
            angle: 0,
            rValues: [params.vectorPos1.x + 8, params.vectorPos1.x, params.vectorPos1.x + 8],
            angleValues: [0.4, 0, -0.4],
            state: 1
        }
        this.position.set(x, y, z)

    }

    rotateCamera(speed, rStep, toR, toAngle) {
           //state 0 1 2
           if (this.cameraMovement.angle != toAngle) {
                speed *= params.timeStep * Math.sign(toAngle - this.cameraMovement.angle)
                this.cameraMovement.angle += speed
                let x = Math.cos(this.cameraMovement.angle) * this.cameraMovement.r
                let y = Math.sin(this.cameraMovement.angle) * this.cameraMovement.r
                this.position.set(x, params.vectorPos1.y, y)
                this.lookAt(new THREE.Vector3(0, 0, 0))
                if (Math.abs(this.cameraMovement.angle - toAngle) < Math.abs(speed))
                    this.cameraMovement.angle = toAngle
                
                if (this.cameraMovement.r !== toR) {
                    let step = Math.sign(toR - this.cameraMovement.r) * rStep
                    if (Math.abs(this.cameraMovement.r - toR) < Math.abs(step))
                        this.cameraMovement.r = toR
                    else
                        this.cameraMovement.r += step
                }
           }
    }

    moveInCircle(state) {
        let speed = this.cameraMovement.speed
        let toR = this.cameraMovement.rValues[state]
        let toAngle = this.cameraMovement.angleValues[state]
        let rStep = 0.66
        this.rotateCamera(speed, rStep, toR, toAngle)
    }

    update() {
        this.moveInCircle(this.cameraMovement.state)
    }
}

