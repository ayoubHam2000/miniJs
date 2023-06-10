import { params } from "../Utils/Params"
import { Vector2D } from "../MyMath"


export class GameConst {

    constructor() {
        this.player = this.#playerInfo()

        //params
        params.gravityForce = this.#getGravity()
        params.groundVelocity = this.#getVelocityAfterHitGround()
    }

    #playerInfo () {
        const hOffset = 12
        const wOffset = 3
        const planePoints = {
            p1 : new Vector2D(params.planeDim.x / 2 + hOffset, +params.planeDim.y / 2 + wOffset),
            p2 : new Vector2D(params.planeDim.x / 2 + hOffset, -params.planeDim.y / 2 - wOffset),
            p3 : new Vector2D(1, +params.planeDim.y / 2 + wOffset),
        }

        if (params.PLAYER_ID === 2) {
            planePoints.p1 = new Vector2D(params.planeDim.x / 2, +params.planeDim.y / 2)
            planePoints.p2 = new Vector2D(params.planeDim.x / 2, +params.planeDim.y / 2)
            planePoints.p3 = new Vector2D(params.planeDim.x / 2, +params.planeDim.y / 2)
        }

        const planeProperties = this.#getPlaneProperties(planePoints)

        return {
            p1: planePoints.p1,
            p2: planePoints.p2,
            p3: planePoints.p3,
            matrix: planeProperties.matrix,
            invMatrix: planeProperties.invMatrix
        }
    }

    #getPlaneProperties(points) {
        const p1 = points.p1
        const p2 = points.p2
        const p3 = points.p3
    
        const vector1 = {
            x: p3.x - p1.x,
            y: p3.y - p1.y
        }
        const vector2 = {
            x: p2.x - p1.x,
            y: p2.y - p1.y
        }
     
        const matrix = {
            a: vector1.x, b: vector2.x,
            c: vector1.y, d: vector2.y
        }
    
        const det = 1 / (matrix.a * matrix.d - matrix.b * matrix.c)
    
        const invMatrix = {
            a: matrix.d * det, b: - matrix.b * det,
            c: - matrix.c * det, d: matrix.a * det
        }
        return {
            matrix, invMatrix
        }
    }

    #getGravity() {
        return (2 * params.maxHeight) / (params.timeToFall ** 2)
    }
    
    #getVelocityAfterHitGround() {
        return (Math.sqrt(2 * params.gravityForce * params.maxHeight))
    }

    setTimeToFall(newValue, world) {
        params.timeToFall = newValue
        params.gravityForce = this.#getGravity()
        world.gravity = new Vec3(0, - params.gravityForce, 0)
    }
}
