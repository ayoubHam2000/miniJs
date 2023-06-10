import { Game } from "./Game"
import { TrailRenderer } from "./Trail"
import { Spot } from "./Spot"
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
        this.rayCollision = new THREE.Raycaster()
        this.velocity = new THREE.Vector3()
        this.downWallObj = this.scene.downWallObj
        this.planeObj = this.scene.planeObj
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


        //fun
        this.spotTarget = this.spotObj()
        this.scene.add(this.spotTarget)
        this.init()

        this.trail = new TrailRenderer(game, this)
        
        this.spot = new Spot()
        this.scene.add(this.spot)
        
        this.add(this.getObject())
        this.scene.add(this)
    }

    getObject() {
        const sphereGeo = new THREE.SphereGeometry(params.ballDim);
        const sphereMat = new THREE.MeshStandardMaterial({ 
            color: 0xff0000, 
            wireframe: false,
        });
        const sphereObj = new THREE.Mesh(sphereGeo, sphereMat);
        return (sphereObj)
    }

    init() {
        this.lose(this, "init")
    }

    changeTurn(to) {
        if (!to) {
            this.game.gameInfo.turn = (this.game.gameInfo.turn + 1) % 2
        } else {
            this.game.gameInfo.turn = to    
        }
        this.bounce = 0
        console.log("Turn: ", this.game.gameInfo.turn)
    }

    lose(obj, cause) {
        console.log(cause)
        obj.initialize = true
        obj.initBounce = true
        obj.netLose = false
        obj.position.y = 5
        obj.velocity.set(0, 0, 0)
        obj.game.camera.cameraMovement.state = 1
        obj.bounce = 0
        if (cause !== "init") {
            if (obj.game.gameInfo.turn === 1)
                obj.game.gameInfo.scorePlayer1++
            else
                obj.game.gameInfo.scorePlayer2++
        }
        console.log("Score1: ", obj.game.gameInfo.scorePlayer1, " Score2: ", obj.game.gameInfo.scorePlayer2)
    }

    reset() {
        if (this.position.y <= -1 || this.position.y > 80) {
           this.lose(this, "out of bound")
        }
    }

    spotObj() {
        const spotGeo = new THREE.CircleGeometry(params.ballDim, 23);
        const spotMap = new THREE.MeshStandardMaterial({ 
            color: 0xffffff, 
            wireframe: false,
            side: THREE.DoubleSide
        });
        const spot = new THREE.Mesh(spotGeo, spotMap);
        spot.rotation.x = Math.PI / 2
        return (spot)
    }

    spotObjUpdate() {
        let p = this.game.guiParams.getVal("spotPos", {x: 0.75, y : 0.5, speed : 0}, 0, 1, 0.001)
        let x = ((p.x * 2) - 1) * (params.planeDim.x / 2)
        let y = ((p.y * 2) - 1) * (params.planeDim.y / 2)
        let speed = p.speed * 3 + 1

        this.spotTarget.p = p
        this.spotTarget.x = x
        this.spotTarget.y = y
        this.spotTarget.speed = speed
        this.spotTarget.position.set(x, 0.3, y)
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
        if (x > 0.95)
            x = 0.8
        else if (x > 0.2)
            x = 0.5
        else
            x = 0.2
        return (x)
    }

    hit(x, y) {
        if (this.bounce === 0) {
            this.netLose = true
            console.log(this.netLose)
            setTimeout(this.lose, 300, this, "no bounce")
            //this.lose(this, "no bounce")
        }
        // 0 <= x <= 1 || -1 <= y <= 1
        //this.position.y += 1
        x = this.getDiscretePosX(x)
        let posX = x * (this.limit.x.b - this.limit.x.a) + this.limit.x.a
        let posY = ((y + 1) * 0.5) * (this.limit.y.b - this.limit.y.a) + this.limit.y.a
        let speed = this.getDiscreteSpeed(posX)
        this.camera.cameraMovement.state = 1
        this.setVelocity(posX, posY, speed)
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


        this.changeTurn()
        this.velocity.x = xVelocity
        this.velocity.z = zVelocity
        this.velocity.y = yVelocity
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
        
        const arr = rayCaster.intersectObjects([this.planeObj, this.netObj])
        if (arr.length) {
            const newPos = arr[0].point
            newPos.x -= normalizedVelocity.x * this.ballDim
            newPos.y -= normalizedVelocity.y * this.ballDim
            newPos.z -= normalizedVelocity.z * this.ballDim
            this.position.copy(newPos)
            if (arr[0].object.id === this.planeObj.id) {
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
                    this.lose(this, "tow bounce")
                }
                //this.init()
                this.spot.hit(newPos)
            } 
            else {
                // console.log(this.netObj)
                if (params.netCollision) {
                    this.netObj.hit()
                    this.velocity.x = -2 * Math.sign(this.velocity.x)
                    this.velocity.y = 0.2
                    this.velocity.z = 2 *  Math.sign(this.velocity.z)
                    this.netLose = true
                    console.log(this.netLose)
                    setTimeout(this.lose, 1000, this, "net collision")
                } else
                    this.move()
            }
        } else {
            this.move()
        }
    }




    update() {
        this.trail.update()
        this.spot.update()
        if (!this.initialize) {
            this.trail.stop = false
            this.spotObjUpdate()
            this.ballPhy()
            this.reset()
        } else {
            this.trail.stop = true
        }
    }
}