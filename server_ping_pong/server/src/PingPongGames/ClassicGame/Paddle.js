const params = require("./Params")

module.exports = class Paddle {
    constructor() {
        this.speed = 4
        this.addedSpeed = 0
        this.maxAdd = 12
        this.dir = 0
        this.timeStep = params.timeStep
    }


    isIn(pos) {
        if (pos.y <= this.y1 && pos.y >= this.y2)
            return (true)
        return (false)
    }

    #addSpeed(e) {
        if (e === 0) {
            if (this.addedSpeed >= 1)
                this.addedSpeed -= 1
            else
                this.addedSpeed = 0
        } else {
            if (this.addedSpeed < this.maxAdd)
                this.addedSpeed += 0.5
            else
                this.addedSpeed = this.maxAdd
        }
    }

    setPos(pos, e = 0)
    {
        this.#addSpeed(e)
        this.position.y += (this.speed + this.addedSpeed) * this.timeStep * e
        this.cx = pos.x
        this.x1 = pos.x - params.paddleDim.x / 2
        this.x2 = pos.x + params.paddleDim.x / 2

        const cy = pos.y
        const y1 = pos.y + params.paddleDim.y / 2
        const y2 = pos.y - params.paddleDim.y / 2

        if (y1 < params.sceneDim.y * 0.5 && y2 > params.sceneDim.y * -0.5) {
            this.cy = cy
            this.y1 = y1
            this.y2 = y2
        } else if (y1 >= params.sceneDim.y * 0.5) {
            this.position.y = params.sceneDim.y * 0.5 - params.paddleDim.y * 0.5
        } else {
            this.position.y = params.sceneDim.y * -0.5 + params.paddleDim.y * 0.5
        }
    }
}