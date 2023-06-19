import { params } from "../Utils/Params"
import * as THREE from 'three'

export class Ball extends THREE.Object3D{
    
   
    constructor(game) {
        super()
        this.game = game
        this.scene = game.scene
        this.camera = game.camera
        this.timeStep = params.timeStep
        this.ballDim = params.ballDim
      
        this.velocity = new THREE.Vector3(-2, 2, 0)
        this.speed = 10
       
        this.init()

        const objs = this.#getObjects()

        this.ballObj = objs.ballObj
        this.trailObj = [this.createNewObj(this.position)]
        this.add(this.ballObj)


        this.scene.add(this)
    }


    #getObjects() {
       return {
            ...this.#getBallObj()
       }
    }

    #getBallObj() {
        const sphereGeo = new THREE.CircleGeometry(params.ballDim);
        const sphereMat = new THREE.MeshBasicMaterial({ 
            color: 0xffffff
        });
        const sphereObj = new THREE.Mesh(sphereGeo, sphereMat);
        return {
            ballObj: sphereObj
        }
    }

    createNewObj(pos) {
        const sphereGeo = new THREE.CircleGeometry(params.ballDim);
        const sphereMat = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            blending: THREE.MultiplyBlending,
            opacity: 0.5
        });
        const sphereObj = new THREE.Mesh(sphereGeo, sphereMat);
        sphereObj.position.set(pos.x, pos.y, 0)
        this.scene.add(sphereObj)
        return (sphereObj)
    }

    reset() {
        if (Math.abs(this.position.x) > params.sceneDim.x / 2) {
            this.init()
        }
    }

    init() {
        this.position.set(0, 0, 0)
        this.velocity.set(-1, 0, 0)
    }

    newYVector() {
        let cy = this.game.scene.player2.cy
        if (this.position.x < 0)
            this.game.scene.player1.cy
        let distY = -2 * (cy - this.position.y) / params.paddleDim.y
        if (Math.abs(distY) > 0.8)
            distY = 0.8 * Math.sign(distY)
        let v = new THREE.Vector2(Math.sqrt(1 - distY * distY), distY)
        this.velocity.x = v.x * Math.sign(this.velocity.x)
        this.velocity.y = v.y
    }

    move() {
        let nextX = this.position.x + this.velocity.x * this.timeStep * this.speed
        let nextY = this.position.y + this.velocity.y * this.timeStep * this.speed
        let rfx = 1
        let rfy = 1

        let y1 = params.sceneDim.y * 0.5 - params.ballDim
        let y2 = params.sceneDim.y * -0.5 + params.ballDim
        if (this.velocity.y > 0 && nextY >= y1) {
            rfy = -1
            nextY = y1
        } else if (this.velocity.y < 0 && nextY <= y2) {
            rfy = -1
            nextY = y2
        }
        
        
        let x = undefined
        if (this.velocity.x < 0 && this.game.scene.player1.isIn(this.position))
            x = params.sceneDim.x * -0.5 + params.ballDim + params.paddleDim.x
        else if (this.velocity.x > 0 && this.game.scene.player2.isIn(this.position))
            x = params.sceneDim.x * 0.5 - params.ballDim - params.paddleDim.x
        if (x && Math.sign(nextX - x) === Math.sign(this.velocity.x)) {
            this.newYVector()
            rfx = -1
            nextX = x
        }

        this.trailObj[0].position.set(this.position.x, this.position.y)
        this.velocity.x *= rfx
        this.velocity.y *= rfy
        this.position.x = nextX
        this.position.y = nextY
    }


    socketGetBallInfo(data) {
        const position = data.position
        const velocity = data.velocity
        this.position.set(position.x, position.y, position.z)
        this.velocity.set(velocity.x, velocity.y, velocity.z)
        this.trail.stop = data.init
        if (data.spotPos)
            this.spot.hit(data.spotPos)
        if (data.net)
            this.game.scene.netObj.hit()
    }

    update() {
        this.move()
        this.reset()
    }
}