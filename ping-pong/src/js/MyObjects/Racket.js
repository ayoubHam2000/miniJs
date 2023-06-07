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

        this.testInit()
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
        racketParent.position.set(0, 2.5, 0)
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
            
            //racket rotation
            const newAngle = - Math.PI * 1.5 * (b * 2 - 1)
            if (newAngle > - Math.PI / 2 && newAngle < Math.PI / 2){
                this.racketParent.rotation.x = newAngle
            }
        }
    }

   

    testInit() {
        const point1Geometry = new THREE.CircleGeometry(0.25, 10)
        const point1Material = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            side: THREE.DoubleSide,
            wireframe: false
        })
        const point1Obj = new THREE.Mesh(point1Geometry, point1Material)
        point1Obj.rotation.y = 0.5 * Math.PI

        const point2Geometry = new THREE.CircleGeometry(0.25, 10)
        const point2Material = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
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

    testUpdate() {
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
                let maxDist = 4
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

    testIsInRange() {
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

     

    testHit() {
        function perform(obj) {
            params.isClicked = false
            obj.clickInfo.canPerform = true
            let distX = (obj.planeX - obj.clickInfo.startX) / 4
            let distY = (obj.planeY - obj.clickInfo.startY) / 4
            distX = Math.abs(distX)
            distX = distX * distX * distX
            distY = Math.sqrt(Math.abs(distY)) * Math.sign(distY)
            //console.log(distX, distY)
            obj.ballObj.hit(distX, distY)
        }

        let rangeInfo = this.testIsInRange()
        if (rangeInfo.value && this.clickInfo.canPerform && rangeInfo.xDist > 0) {
            this.clickInfo.canPerform = false
            setTimeout(perform, 100, this)
        }
    }


    //===========

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

    hit(mouseVelocity) {
        // 0 < x <= 3 and -2 <= y <= 2 and 100 <= time <= 500
        mouseVelocity.x = Math.min(2, mouseVelocity.x) / 2
        mouseVelocity.y = Math.min(2, Math.abs(mouseVelocity.y)) * Math.sign(mouseVelocity.y) / 2
        //mouseVelocity.time = Math.max(100, mouseVelocity.time)
        let dist = Math.sqrt(mouseVelocity.x ** 2 + mouseVelocity.y ** 2)
        mouseVelocity.x = mouseVelocity.x ** 0.5
        mouseVelocity.y = mouseVelocity.y ** 2
      
        
        // let x = 0.5 + Math.abs(mouseVelocity.x / 2)
        // let y = 0.5 + mouseVelocity.y / 2
        // let v = (dist / mouseVelocity.diffTime) * 100
        //console.log("d", dist, v)
        //let speed = v * (params.planeDim.x * 1.1)
        
        let posX = (mouseVelocity.x * params.planeDim.x * -1) / 2
        console.log(posX, mouseVelocity, dist)

        //let posY = ((y * 2) - 1) * (params.planeDim.y / 2)
        this.ballObj.setVelocity(posX, 0, 10)
    }

    racketBallHit() {
        const rangeInfo = this.isInRange()
        //changing clickInfo
        if (!params.isClicked || (params.isClicked && performance.now() - this.clickInfo.startTime > 200)) {
            this.clickInfo.startX = rangeInfo.xDist
            this.clickInfo.startY = rangeInfo.zDist
            this.clickInfo.startTime = performance.now()
        }

        if (rangeInfo.value === true) {
            let diff = {
                x: this.clickInfo.startX - rangeInfo.xDist,
                y: this.clickInfo.startY - rangeInfo.zDist,
                time: performance.now() - this.clickInfo.startTime
            }
            let mouseVelocity = {
                x: diff.x,
                y: diff.y,
                time: diff.time
            }
            if (diff.x > 0)
             this.hit(mouseVelocity)
            params.isClicked = false
        }
 
       
    }


    update() {
        this.racketPhy()
        //this.racketBallHit()
        this.testUpdate()
        this.testHit()
    }
}