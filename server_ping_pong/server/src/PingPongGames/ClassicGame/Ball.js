const THREE = require('three')
const params = require('./Params')

module.exports = class Ball {
    constructor(game) {
        this.game = game
        this.timeStep = params.timeStep
        this.ballDim = params.ballDim

        this.position = new THREE.Vector2()
        this.velocity = new THREE.Vector2()
        this.speed = 10

        this.info = {
            lose : false,
            init: true
        }

        this.init(this)
    }

    //=================================

    reset() {
        if (Math.abs(this.position.x) > params.sceneDim.x / 2) {
            if (this.position.x < 0)
                this.game.changeScore([0, 1])
            else
                this.game.changeScore([1, 0])
            this.init(this)
        }
    }

    init(ball) {
        function perform() {
            ball.velocity.set(-1, 0, 0)
            ball.info.lose = false
        }
        ball.position.set(0, 0, 0)
        ball.info.lose = true
        setTimeout(perform, 1000)
    }

    newYVector() {
        let cy = this.game.player2.cy
        if (this.position.x < 0)
            this.game.player1.cy
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
        if (this.velocity.x < 0 && this.game.player1.isIn(this.position))
            x = params.sceneDim.x * -0.5 + params.ballDim + params.paddleDim.x
        else if (this.velocity.x > 0 && this.game.player2.isIn(this.position))
            x = params.sceneDim.x * 0.5 - params.ballDim - params.paddleDim.x
        if (x && Math.sign(nextX - x) === Math.sign(this.velocity.x)) {
            this.newYVector()
            rfx = -1
            nextX = x
        }

        this.velocity.x *= rfx
        this.velocity.y *= rfy
        this.position.x = nextX
        this.position.y = nextY
    }

    #socketSendBallInfo() {
        // if (params.frame % 3 !== 0)
        //     return
        let data = {
            position: this.position,
            velocity: this.velocity,
            speed: this.speed
        }
        this.game.room.sendBallInfoClassic(data)
    }

    update() {
        if (this.info.lose === false) {
            this.move()
            this.reset()
        }
        this.#socketSendBallInfo()
    }
}
