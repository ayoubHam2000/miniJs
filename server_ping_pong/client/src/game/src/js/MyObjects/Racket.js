import * as THREE from 'three'
import {params} from '../Utils/Params'

export class Racket extends THREE.Object3D {
    constructor(game) {
        super()

        this.game = game
        this.scene = game.scene
        this.camera = game.camera
        this.gameConst = game.gameConst
        this.ballObj = game.scene.ballObj
        this.rayMouseCamera = new THREE.Raycaster()
        this.planeX = 0
        this.planeY = 0
        this.vecPlaneX = 0.5
        this.vecPlaneY = 0.5

        this.clickInfo = {
            startX: -1,
            startY: -1,
            startTime: 0,
            counter: 0,
            dx: 0,
            dy: 0,
            dt: 0,
            canPerform: true
        }

        const racket =  this.getObject()
        this.racketModel = racket.racketModel
        this.racketParent = racket.racketParent
        this.add(this.racketParent)
        game.scene.add(this)

        this.init()
    }

    getObject() {
        const racketModel = this.scene.racketModel
        racketModel.scale.set(0.15, 0.15, 0.15)
        racketModel.rotation.y = Math.PI / 2

        
        const racketParent = new THREE.Group()
        racketParent.add(racketModel)

        // const infinitePlaneGeometry = new THREE.PlaneGeometry(5, 5)
        // const infinitePlaneMaterial = new THREE.MeshBasicMaterial({
        //     color: 0x0000ff,
        //     side: THREE.DoubleSide,
        //     wireframe: true
        // })
        // const infinitePlaneObj = new THREE.Mesh(infinitePlaneGeometry, infinitePlaneMaterial)
        // infinitePlaneObj.rotation.y = 0.5 * Math.PI
        // racketParent.add(infinitePlaneObj)
        
        //let pos = this.game.guiParams.getVal("psss", {x:0, y:2, z:0}, -2, 4, 0.001)
        racketModel.position.y = -1.5
        this.position.set(0, 2.5, 0)
        return {
            racketModel,
            racketParent
        }
    }

    racketPhy() {
        //Get mouse intersection with the plane coordinate
        
        const mousePosition = new THREE.Vector2(params.mousePosition.x, params.mousePosition.y)
        this.rayMouseCamera.setFromCamera(mousePosition, this.camera)
        const intersects = this.rayMouseCamera.intersectObject(this.scene.infinitePLaneObj)

        //If there is an intersection
        if (intersects.length) {
            // translating the plan so that p1 becomes the origin.
            const p = {
                x: intersects[0].point.x - this.gameConst.player.p1.x,
                y: intersects[0].point.z - this.gameConst.player.p1.y
            }
            
            //getCoefficient a, b of vec1 and vec2 of the plane
            const invMatrix = this.gameConst.player.invMatrix
            const a = p.x * invMatrix.a + p.y * invMatrix.c
            const b = p.x * invMatrix.b + p.y * invMatrix.d
            
            //info
            this.planeX = intersects[0].point.x
            this.planeY = intersects[0].point.z
            this.vecPlaneX = a
            this.vecPlaneY = b

            //move the racket my the position of the mouse
           
            this.position.z = intersects[0].point.z
            this.position.x = intersects[0].point.x

            

            //limit the racket in the plane
            if (b < 0)
                this.position.z = this.gameConst.player.p1.y
            else if (b > 1)
                this.position.z = this.gameConst.player.p2.y
        
            if (a < 0)
                this.position.x = this.gameConst.player.p1.x
            else if (a > 1)
                this.position.x = this.gameConst.player.p3.x
            
            this.game.socketMgr.racketMove({
                position: this.position
            })
            //racket rotation
            const newAngle = - Math.PI * 1.5 * (b * 2 - 1)
            if (newAngle > - Math.PI / 2 && newAngle < Math.PI / 2){
                this.racketParent.rotation.x = newAngle
            }
        }
    }

    init() {
        const point1Geometry = new THREE.CircleGeometry(0.125, 10)
        const point1Material = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            side: THREE.DoubleSide,
            wireframe: false
        })
        const point1Obj = new THREE.Mesh(point1Geometry, point1Material)
        point1Obj.rotation.y = 0.5 * Math.PI

        const point2Geometry = new THREE.CircleGeometry(0.125, 10)
        const point2Material = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            side: THREE.DoubleSide,
            wireframe: false
        })
        const point2Obj = new THREE.Mesh(point2Geometry, point2Material)
        point2Obj.rotation.y = 0.5 * Math.PI

        point1Obj.position.set(0, 0.3, 0)
        point2Obj.position.set(5, 0.3, 0)
        
        point1Obj.visible = false
        point2Obj.visible = false
        this.point1Obj = point1Obj
        this.point2Obj = point2Obj
        this.scene.add(point1Obj)
        this.scene.add(point2Obj)
    }

    racketDir() {
        if (params.isClicked && !this.point1Obj.visible) {
            this.point1Obj.position.set(this.planeX, 0.3, this.planeY)
            this.point1Obj.visible = true
            this.clickInfo.startX = this.planeX
            this.clickInfo.startY = this.planeY
            this.clickInfo.time = performance.now()
            this.clickInfo.dt = performance.now()
            this.clickInfo.dx = this.planeX
            this.clickInfo.dt = this.planeY
        } else if (params.isClicked && this.point1Obj.visible) {
            let diffDt = performance.now() - this.clickInfo.dt
            let flag = true
            if (diffDt > 50) {
                this.clickInfo.dt = performance.now()
                this.clickInfo.dx = this.planeX - this.clickInfo.dx
                this.clickInfo.dy = this.planeY - this.clickInfo.dy
                let dDist = Math.sqrt(this.clickInfo.dx ** 2 + this.clickInfo.dy ** 2)
                if (dDist < 0.2) {
                    this.point1Obj.visible = false
                    this.point2Obj.visible = false
                    flag = false
                }
                this.clickInfo.dx = this.planeX
                this.clickInfo.dy = this.planeY
            }
            if (flag) {
                this.point2Obj.visible = true
                this.point2Obj.position.set(this.planeX, 0.3, this.planeY)

                let distX = this.planeX - this.clickInfo.startX
                let distY = this.planeY - this.clickInfo.startY
                let dist = Math.sqrt(distX ** 2 + distY ** 2)
                let maxDist = 5
                if (dist > maxDist) {
                    let a = distX * (maxDist / dist)
                    let b = distY * (maxDist / dist)
                    a = this.planeX - a
                    b = this.planeY - b
                    this.point1Obj.position.set(a, 0.3, b)
                    this.clickInfo.startX = a
                    this.clickInfo.startY = b
                }
            }
        } else if (!params.isClicked) {
            this.point1Obj.visible = false
            this.point2Obj.visible = false
        }
    }

    isInRange() {
        let xRange = 4
        let zRange = 2
        let xDist = this.position.x - this.ballObj.position.x
        let zDist = this.position.z - this.ballObj.position.z
        let value = false
        if (params.isClicked && Math.abs(xDist) < xRange && Math.abs(zDist) < zRange && xDist >= -0.1)
            value = true
        return {
            value,
            xDist,
            zDist
        }  
    }

    moveRacket(newPos, speed) {
        // move racket when the ball is close
        // let newPos = 2.5
        // let speed = 0.05
        /*if (Math.abs(dist) < 4 && this.ballObj.velocity.x > 0) {
            newPos = this.ballObj.position.y - 2.5
            speed = 0.2
        }*/
        if (this.position.y !== newPos) {
            let step = Math.sign(newPos - this.position.y) * speed
            if (Math.abs(this.position.y - newPos) < Math.abs(step))
                this.position.y = newPos
            else
                this.position.y +=step
        }
    }
     

    ballInit() {
        this.ballObj.position.x = params.planeDim.x / 2
        this.ballObj.position.z = this.position.z
        this.ballObj.position.y = 3
        console.log("Init Ball", this.ballObj.position)

        let dist = this.ballObj.position.x - this.position.x
        // console.log(dist)
        if (Math.abs(dist) < 2 && dist < 0 && params.isClicked) {
            this.ballObj.initialize = false
            let r = Math.random() * params.planeDim.y * -0.2 * Math.sign(this.ballObj.position.z)
            this.ballObj.velocity.set(-15, 4, r)
            params.isClicked = false
            this.ballObj.changeTurn(1)
            //socket
            let data = {
                position : this.ballObj.position,
                velocity: this.ballObj.velocity
            }
            this.game.socketMgr.sendData(data)
        }
    }

    hit() {
        if (this.game.gameInfo.turn === 1)
            return
        
        function perform(obj) {
            params.isClicked = false
            obj.clickInfo.canPerform = true
            let distX = (obj.planeX - obj.clickInfo.startX) / 5
            let distY = (obj.planeY - obj.clickInfo.startY) / 5
            distX = Math.abs(distX)
            distX = distX * distX * distX
            distY = Math.sqrt(Math.abs(distY)) * Math.sign(distY)
            //console.log(distX, distY)
            let data = obj.ballObj.hit(distX, distY)
            obj.game.socketMgr.sendData(data)
        }

        let rangeInfo = this.isInRange()
        this.moveRacket(2.5, 0.05)
        if (rangeInfo.value && rangeInfo.xDist > 0) {
            if (this.clickInfo.canPerform) {
                this.clickInfo.canPerform = false
                setTimeout(perform, 100, this)
            } else {
                this.ballObj.velocity.x = 0
                this.ballObj.position.x = this.position.x - 1
                this.moveRacket(this.position.y, 0.2)
                //this.position.y = this.ballObj.position.y
            }
        }
    }

    update() {
        this.racketPhy()
        this.racketDir()
        if (this.ballObj.initialize && this.game.getTurn() === 0) {
            this.ballInit()
        } else if (this.game.gameInfo.turn === 0) {
            this.hit()
        }
        
    }
}