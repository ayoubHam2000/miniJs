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

        this.trail = new TrailRenderer(game, this)
        this.spot = new Spot()
        this.scene.add(this.spot)
        this.add(this.getObject())
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


    reset() {
        if (this.position.y <= -1 || params.frame === 1) {
            this.position = new THREE.Vector3(0, 5, 0)
            this.velocity = new THREE.Vector3(0, 5, 0)
        }
    }

    move() {
        this.position.x += this.velocity.x * this.timeStep
        this.position.y += this.velocity.y * this.timeStep
        this.position.z += this.velocity.z * this.timeStep
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
                this.velocity.y *= -1
                this.spot.hit(newPos)
            }
        } else {
            this.move()
        }
    }




    update() {
        this.trail.update()
        this.spot.update()
        this.move()
        this.ballPhy()
        this.reset()
    }
}