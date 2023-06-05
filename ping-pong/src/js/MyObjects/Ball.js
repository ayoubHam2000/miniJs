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
        this.racket = game.scene.racketObj
        this.timeStep = params.timeStep
        this.ballDim = params.ballDim
        this.rayCollision = new THREE.Raycaster()
        this.velocity = new THREE.Vector3()
        this.downWallObj = this.scene.downWallObj
        this.planeObj = this.scene.planeObj
        this.gravityForce = params.gravityForce

        //fun
        this.spotTarget = this.spotObj()
        this.init()

        //obj
        this.trail = new TrailRenderer(game, this)
        this.spot = new Spot()
        this.add(this.getObject())
        
        //scene
        this.scene.add(this.spot)
        this.scene.add(this.spotTarget)
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
        this.position.set(5, 5, 0)
        // this.velocity.set(0, -1, 0)
        this.changeSpot()
    }

    reset() {
        if (this.position.y <= -1 || this.position.y > 30 || params.frame === 1) {
           this.init()
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
        let speed = p.speed * 20 + 0.5

        this.spotTarget.p = p
        this.spotTarget.x = x
        this.spotTarget.y = y
        this.spotTarget.speed = speed
        this.spotTarget.position.set(x, 0.3, y)
    }

    changeSpot() {
        this.setVelocity(this.spotTarget.x, this.spotTarget.y, this.spotTarget.speed)
    }

    setVelocity(posX, posZ, timeToFall) {
        //speed < 0 => distance.x < 0 => time > 0
        //speed > 0 => distance.x > 0 => time > 0
        //distance.y < 0 => zVelocity < 0 ...
        let distance = {
            x: posX - this.position.x,
            y: posZ - this.position.z,
            z: this.position.y
        }
        let xVelocity = distance.x / timeToFall
        let zVelocity = distance.y / timeToFall
        let yVelocity = 0.5 * this.gravityForce * timeToFall - distance.z / timeToFall

        this.velocity.x = xVelocity
        this.velocity.z = zVelocity
        this.velocity.y = yVelocity
    }

    /*******************************
    *            Update            
    *******************************/

    move() {
        this.position.x += this.velocity.x * this.timeStep
        this.position.y += this.velocity.y * this.timeStep
        this.position.z += this.velocity.z * this.timeStep
        this.velocity.y = - this.gravityForce * this.timeStep + this.velocity.y
    }

    ballPhy() {
        const rayCaster = this.rayCollision
        
        //init rayCaster
        let normalizedVelocity = this.velocity.clone().normalize()
        rayCaster.set(this.position, normalizedVelocity)
        rayCaster.far = (this.velocity.length() * this.timeStep) + this.ballDim
        
        const arr = rayCaster.intersectObjects([this.downWallObj, this.planeObj])
        if (arr.length) {
            const newPos = arr[0].point
            newPos.x -= normalizedVelocity.x * this.ballDim
            newPos.y -= normalizedVelocity.y * this.ballDim
            newPos.z -= normalizedVelocity.z * this.ballDim
            this.position.copy(newPos)
            if (arr[0].object.id === this.downWallObj.id) {
                this.velocity.x *= -1
            } else {
                //this.velocity.y *= -1
                this.init()
                //  this.spot.hit(newPos)
            }
        } else {
            this.move()
        }
    }




    update() {
        this.trail.update()
        this.spot.update()
        this.spotObjUpdate()
        this.ballPhy()
        this.reset()
    }
}