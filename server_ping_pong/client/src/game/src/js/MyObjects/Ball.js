import { Game } from "./Game"
import { TrailRenderer } from "./Trail"
import { Spot } from "./Spot"
import { params } from "../Utils/Params"
import * as THREE from 'three'

export class Ball extends THREE.Object3D{
    
    static LOSE_INIT = 0
    static LOSE_OUT_OF_BOUND = 1
    static LOSE_NET = 2
    static LOSE_DOUBLE_BOUNCE = 3
    static LOSE_NO_BOUNCE = 4

    constructor(game) {
        super()
        this.game = game
        this.scene = game.scene
        this.camera = game.camera
        this.timeStep = params.timeStep
        this.ballDim = params.ballDim
        this.rayCollision = new THREE.Raycaster()
        this.velocity = new THREE.Vector3()
        this.netObj = this.scene.netObj
        this.gravityForce = params.gravityForce
        this.groundInfo = {
            //used by bot
            v : new THREE.Vector3(), // velocity
            p : new THREE.Vector3() // position
        }

        this.bounce = 0
        this.initialize = true
        this.initBounce = true
        this.netLose = false
        this.theLose = false
        this.limit = {
            x: {
                a : - params.planeDim.x * 0.05,
                b : - params.planeDim.x * 0.45
            },
            y : {
                a: - params.planeDim.y * 0.46,
                b: + params.planeDim.y * 0.46
            },

            botX: {
                a : params.planeDim.x * 0.1,
                b : params.planeDim.x * 0.45
            },
            botY : {
                a: - params.planeDim.y * 0.46,
                b: + params.planeDim.y * 0.46
            }
        }



        this.init()

        this.trail = new TrailRenderer(game, this)
        
        this.spot = new Spot()
        this.scene.add(this.spot)
        
        const objs = this.getObjects()

        this.ballObj = objs.ballObj
        this.add(this.ballObj)

        this.tablePlaneObj = objs.tablePlaneObj
        this.scene.add(this.tablePlaneObj)
        
        this.scene.add(this)
    }

    getObjects() {
       return {
            ...this.getTablePlaneObj(),
            ...this.getBallObj()
       }
    }

    getTablePlaneObj() {
        const tablePlaneGeometry = new THREE.PlaneGeometry(params.planeDim.x, params.planeDim.y)
        const tablePlaneMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            wireframe: false
        })
        const tablePlaneObj = new THREE.Mesh(tablePlaneGeometry, tablePlaneMaterial)
        tablePlaneObj.rotation.x = - 0.5 * Math.PI

        return {
            tablePlaneObj
        }
    }

    getBallObj() {
        const sphereGeo = new THREE.SphereGeometry(params.ballDim);
        const sphereMat = new THREE.MeshStandardMaterial({ 
            color: 0xff0000, 
            wireframe: false,
        });
        const sphereObj = new THREE.Mesh(sphereGeo, sphereMat);
        sphereObj.castShadow = true
        return {
            ballObj: sphereObj
        }
    }

    init() {
        this.lose(Ball.LOSE_INIT)
    }

    loseInit(obj) {
        obj.initialize = true
        obj.initBounce = true
        obj.netLose = false
        obj.position.y = 5
        obj.velocity.set(0, 0, 0)
        obj.bounce = 0
        obj.theLose = false
    }

    lose(cause, time) {
        this.theLose = true
        let arr = {}
        arr[Ball.LOSE_INIT] = "init"
        arr[Ball.LOSE_OUT_OF_BOUND] = "out of bound"
        arr[Ball.LOSE_NET] = "net"
        arr[Ball.LOSE_DOUBLE_BOUNCE] = "double bounce"
        arr[Ball.LOSE_NO_BOUNCE] = "no bounce"
        

        if (cause !== Ball.LOSE_INIT) {
            let p = [0, 0]
            if (this.position.x < 0) {
                if (cause === Ball.LOSE_OUT_OF_BOUND) {
                    p = [1, 0]
                } else if (cause === Ball.LOSE_NET) {
                    p = [1, 0]
                } else if (cause === Ball.LOSE_DOUBLE_BOUNCE) {
                    p = [1, 0]
                } else if (cause === Ball.LOSE_NO_BOUNCE) {
                    p = [1, 0]
                }
            } else {
                if (cause === Ball.LOSE_OUT_OF_BOUND) {
                    p = [0, 1]
                } else if (cause === Ball.LOSE_NET) {
                    p = [0, 1]
                } else if (cause === Ball.LOSE_DOUBLE_BOUNCE) {
                    p = [0, 1]
                } else if (cause === Ball.LOSE_NO_BOUNCE) {
                    p = [0, 1]
                }
            }
            this.game.gameInfo.scorePlayer1 += p[0]
            this.game.gameInfo.scorePlayer2 += p[1]
        }
        let s = this.position.x < 0 ? "Bot Side" : "My Side"
        console.log(arr[cause], s, " Score1: ", this.game.gameInfo.scorePlayer1, " Score2: ", this.game.gameInfo.scorePlayer2)
        if (time) {
            setTimeout(this.loseInit, time, this)
        } else {
            this.loseInit(this)
            this.theLose = false
        }
    }

    reset() {
        if (this.position.y <= -1 || this.position.y > 80) {
           this.lose(Ball.LOSE_OUT_OF_BOUND)
        }
    }

    getDiscreteSpeed(posX) {
        let discreteSpeed = [0.75, 1, 1.25]
        let range = (params.planeDim.x * 0.5) / discreteSpeed.length
        for (let i = 0; i < discreteSpeed.length; i++) {
            let dist = range * (i + 1)
            if (Math.abs(posX) <= dist)
                return discreteSpeed[i]
        }
        return (discreteSpeed[0])
    }

    getDiscretePosX(x) {
        // 0 <= x <= 1
        if (x > 0.92)
            x = 0.8
        else if (x > 0.15)
            x = 0.5
        else
            x = 0.2
        return (x)
    }

    hit(x, y) {
        if (this.bounce === 0) {
            this.netLose = true
            this.lose(Ball.LOSE_NO_BOUNCE, 300)
        }
        // 0 <= x <= 1 || -1 <= y <= 1
        //this.position.y += 1
        x = this.getDiscretePosX(x)
        let posX = x * (this.limit.x.b - this.limit.x.a) + this.limit.x.a
        let posY = ((y + 1) * 0.5) * (this.limit.y.b - this.limit.y.a) + this.limit.y.a
        let speed = this.getDiscreteSpeed(posX)
        return (this.setVelocity(posX, posY, speed))
    }

    setVelocity(posX, posZ, speed) {
        //speed < 0 => distance.x < 0 => time > 0
        //speed > 0 => distance.x > 0 => time > 0
        //distance.y < 0 => zVelocity < 0 ...
        let distance = {
            x: posX - this.position.x,
            y: posZ - this.position.z,
            z: this.position.y
        }
        let speed2d = new THREE.Vector2(distance.x, distance.y).normalize()
        let dist = Math.sqrt(distance.x ** 2 + distance.y ** 2)
        speed2d.multiplyScalar(dist * speed)
        let time = 1 / speed
       
        let xVelocity = speed2d.x
        let zVelocity = speed2d.y
        let yVelocity = 0.5 * this.gravityForce * time - distance.z / time


        this.game.changeTurn()
        this.velocity.x = xVelocity
        this.velocity.z = zVelocity
        this.velocity.y = yVelocity
        return {
            position: this.position,
            velocity: this.velocity
        }
    }

    /*******************************
    *            Update            
    *******************************/

    move() {
        if (!this.initialize) {
            this.position.x += this.velocity.x * this.timeStep
            this.position.y += this.velocity.y * this.timeStep
            this.position.z += this.velocity.z * this.timeStep
            this.velocity.y = - this.gravityForce * this.timeStep + this.velocity.y
        }
    }

    randomPos() {
        //this.position.y += 1
        let x = Math.random() * (this.limit.botX.b - this.limit.botX.a) + this.limit.botX.a
        let y = Math.random() * (this.limit.botY.b - this.limit.botY.a) + this.limit.botY.a
        let speed = this.getDiscreteSpeed(x)
        // console.log(x, y, "=> ", speed)
        // let speed = 0.5 + Math.random()
        return {
            x, y, speed
        }
    }

    ballPhy() {
        const rayCaster = this.rayCollision
        
        //init rayCaster
        let normalizedVelocity = this.velocity.clone().normalize()
        rayCaster.set(this.position, normalizedVelocity)
        rayCaster.far = (this.velocity.length() * this.timeStep) + this.ballDim
        
        const arr = rayCaster.intersectObjects([this.tablePlaneObj, this.netObj])
        if (arr.length) {
            const newPos = arr[0].point
            newPos.x -= normalizedVelocity.x * this.ballDim
            newPos.y -= normalizedVelocity.y * this.ballDim
            newPos.z -= normalizedVelocity.z * this.ballDim
            this.position.copy(newPos)
            if (arr[0].object.id === this.tablePlaneObj.id) {
                this.velocity.y *= -0.8
                this.groundInfo.v.copy(this.velocity)
                this.groundInfo.p.copy(this.position)
                if (this.netLose === false)
                    this.bounce++
                if (this.initBounce) {
                    this.initBounce = false
                    this.bounce--
                }
                if (this.bounce === 2) {
                    this.lose(Ball.LOSE_DOUBLE_BOUNCE)
                }
                //this.init()
                this.spot.hit(newPos)
            } 
            else {
                // console.log(this.netObj)
                if (params.netCollision && this.theLose === false) {
                    this.netObj.hit()
                    this.velocity.x = -2 * Math.sign(this.velocity.x)
                    this.velocity.y = 0.2
                    this.velocity.z = 2 *  Math.sign(this.velocity.z)
                    this.netLose = true
                    //console.log(this.netLose)
                    this.lose(Ball.LOSE_NET, 1000)
                } else
                    this.move()
            }   
        } else {
            this.move()
        }
    }


    changeColor() {
        let t = (this.game.getTurn() + this.game.gameInfo.initTurn) % 2
        if (t === 0)
            this.ballObj.material.color.set(0x00ff00)
        else if (t === 1)
            this.ballObj.material.color.set(0x0000ff)
        else
            this.ballObj.material.color.set(0xff0000)
    }

    update() {
        this.changeColor()
        this.trail.update()
        this.spot.update()
        if (!this.initialize) {
            this.trail.stop = false
            this.ballPhy()
            this.reset()
        } else {
            this.trail.stop = true
        }
    }
}