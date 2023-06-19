const THREE = require('three')
const params = require('./Params')

module.exports = class Ball {
    constructor(game) {
        this.game = game
        this.timeStep = params.timeStep
        this.ballDim = params.ballDim

        this.position = new THREE.Vector2()
        this.velocity = new THREE.Vector2()
        this.speed = 2

        this.init()

        this.info = {
            lose : false,
            init: true
        }
    }

    //=================================

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

        this.trailObj[0].position.set(this.position.x, this.position.y)
        this.velocity.x *= rfx
        this.velocity.y *= rfy
        this.position.x = nextX
        this.position.y = nextY
    }

    update() {
        this.move()
        this.reset()
    }
}