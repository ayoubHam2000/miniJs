const params = require('./Params')
const THREE = require('three')
const Ray = require('./Ray')
const Plane = require('./Plane')

module.exports = class Ball {
    
    static LOSE_OUT_OF_BOUND = 0
    static LOSE_NET = 1
    static LOSE_DOUBLE_BOUNCE = 2
    static LOSE_NO_BOUNCE = 3

    constructor(game) {
        this.game = game
        this.timeStep = params.timeStep
        this.ballDim = params.ballDim
        this.ray = new Ray()
        this.velocity = new THREE.Vector3()
        this.position = new THREE.Vector3()
        
        this.gravityForce = params.gravityForce
        this.groundInfo = {
            //used by bot
            v : new THREE.Vector3(), // velocity
            p : new THREE.Vector3() // position
        }

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

        this.tablePlaneObj = new Plane({x: 0, y: 0, z : 0}, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: 1})
        this.netPlaneObj = new Plane({x: 0, y: 0, z : 0}, {x: 0, y: 1, z: 0}, {x: 0, y: 0, z: 1})

        this.bounce = 0
        this.initialize = true
        this.lose = false

        this.#init()

    }

   
    /*******************************
    *            Lose Init            
    *******************************/

    #init() {
        this.#loseInit(this)
        this.position.set(2, 5, 2)
        this.#directSetVelocity(20, -5, 0)
    }

    #loseInit(obj) {
        console.log("Init")
        obj.initialize = true
        obj.lose = false
        obj.position.y = 5
        obj.velocity.set(0, 0, 0)
        obj.bounce = 0
    }

    #getLoseReason(cause) {
        let arr = {}
       
        arr[Ball.LOSE_OUT_OF_BOUND] = "out of bound"
        arr[Ball.LOSE_NET] = "net"
        arr[Ball.LOSE_DOUBLE_BOUNCE] = "double bounce"
        arr[Ball.LOSE_NO_BOUNCE] = "no bounce"
        return (arr[cause])
    }


    #loseFunction(cause, time) {
        console.log("Lose", cause, time)
        this.#init()
    }

    #reset() {
        if (this.position.y <= -1 || this.position.y > 80) {
           this.#loseFunction(Ball.LOSE_OUT_OF_BOUND)
        }
    }

    /*******************************
    *            Hit            
    *******************************/

    #getDiscreteSpeed(posX) {
        let discreteSpeed = [0.75, 1, 1.25]
        let range = (params.planeDim.x * 0.5) / discreteSpeed.length
        for (let i = 0; i < discreteSpeed.length; i++) {
            let dist = range * (i + 1)
            if (Math.abs(posX) <= dist)
                return discreteSpeed[i]
        }
        return (discreteSpeed[0])
    }

    #getDiscretePosX(x) {
        // 0 <= x <= 1
        if (x > 0.92)
            x = 0.8
        else if (x > 0.15)
            x = 0.5
        else
            x = 0.2
        return (x)
    }

    #hit(x, y) {
        x = Math.abs(x)
        // 0 <= x <= 1 || -1 <= y <= 1
        //this.position.y += 1
        x = this.#getDiscretePosX(x)
        let posX = x * (this.limit.x.b - this.limit.x.a) + this.limit.x.a
        let posY = ((y + 1) * 0.5) * (this.limit.y.b - this.limit.y.a) + this.limit.y.a
        let speed = this.#getDiscreteSpeed(posX)
        if (this.position.x < 0) {
            posX *= -1
            posY *= -1
        }
        return (this.#setVelocity(posX, posY, speed))
    }


    #ballIsHit() {
        if (this.bounce === 0 && this.initialize === false) {
            this.#loseFunction(Ball.LOSE_NO_BOUNCE, 300)
        }
        this.initialize = false
        this.bounce = 0
        this.game.changeTurn()
    }

    #directSetVelocity(x, y, z) {
        if (this.lose === true)
            return
        this.velocity.set(x, y, z)
        this.#ballIsHit()
    }

    randomPos() {
        //this.position.y += 1
        let x = Math.random() * (this.limit.botX.b - this.limit.botX.a) + this.limit.botX.a
        let y = Math.random() * (this.limit.botY.b - this.limit.botY.a) + this.limit.botY.a
        let speed = this.#getDiscreteSpeed(x)
        // console.log(x, y, "=> ", speed)
        // let speed = 0.5 + Math.random()
        return {
            x, y, speed
        }
    }

    botSetVelocity(posX, posZ, speed) {
        this.#setVelocity(posX, posZ, speed)
    }

    #setVelocity(posX, posZ, speed) {
        if (this.lose === true)
            return
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


        this.velocity.x = xVelocity
        this.velocity.z = zVelocity
        this.velocity.y = yVelocity
        this.#ballIsHit()
        return {
            position: this.position,
            velocity: this.velocity
        }
    }

    /*******************************
    *            Update            
    *******************************/

    #move() {
        if (!this.initialize) {
            this.position.x += this.velocity.x * this.timeStep
            this.position.y += this.velocity.y * this.timeStep
            this.position.z += this.velocity.z * this.timeStep
            this.velocity.y = - this.gravityForce * this.timeStep + this.velocity.y
        }
    }

    #incrementBounce() {
        if (this.lose === true)
            return
        
        if (
            (this.velocity.x > 0 && this.position.x >= 0)
            || (this.velocity.x < 0 && this.position.x <= 0)
            ) {
                this.bounce++
            }

        if (this.bounce === 2) {
            this.#loseFunction(Ball.LOSE_DOUBLE_BOUNCE)
        }
    }

    #ballPhy() {
        let moveFlag = true
        const normalizedVelocity = this.velocity.clone().normalize()
        this.ray.set(this.position, normalizedVelocity)
        this.ray.far = (this.velocity.length() * this.timeStep) + this.ballDim

        const arr = this.ray.intersectObjects([this.tablePlaneObj, this.netPlaneObj])
        if (arr.length) {
            const newPos = arr[0].point
            newPos.x -= normalizedVelocity.x * this.ballDim
            newPos.y -= normalizedVelocity.y * this.ballDim
            newPos.z -= normalizedVelocity.z * this.ballDim
            this.velocity.x -= normalizedVelocity.x * this.ballDim
            this.velocity.y -= normalizedVelocity.y * this.ballDim
            this.velocity.z -= normalizedVelocity.z * this.ballDim
            if (arr[0].object === this.tablePlaneObj) {
                this.position.copy(newPos)
                moveFlag = false
                this.velocity.y *= -1
                this.groundInfo.v.copy(this.velocity)
                this.groundInfo.p.copy(this.position)
                this.#incrementBounce()
            } 
            else if (arr[0].object === this.netPlaneObj) {
                if (this.lose === false && newPos.y <= params.netDim.y && Math.abs(newPos.z) <= params.netDim.x / 2) {
                    this.position.copy(newPos)
                    moveFlag = false
                    this.velocity.x = -2 * Math.sign(this.velocity.x)
                    this.velocity.y = 0.2
                    this.velocity.z = 2 *  Math.sign(this.velocity.z)
                    this.#loseFunction(Ball.LOSE_NET, 1000)
                }
            }
        }
        if (moveFlag)
            this.#move()      
    }

    socketReceiveHit(data) {
        this.#hit(data.distX, data.distY)
    }

    #socketSendBallInfo() {
        this.game.room.sendBallInfo(
            {
            position: this.position,
            velocity: this.velocity
        })
    }

    //racket init
    //racket hit ball change pos
    //net
    //spot
    //lose init trail
    //bot
    update() {
        //if (!this.initialize) {
            this.#ballPhy()
            this.#reset()
            this.#socketSendBallInfo()
            
        //}
    }
}