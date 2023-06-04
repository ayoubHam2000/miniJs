import * as THREE from "three";
import { params } from '../Utils/Params'
import { Vector3D, dist3D } from "../MyMath"


export class TrailRenderer {

    constructor(game, obj) {
        this.game = game
        this.scene = game.scene
        this.obj = obj
        this.timeToDisappear = 300
        this.arr = []
        this.lastPoint = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z)
        this.dim = params.ballDim
        this.maxDisplacement = 3
        this.color1 = { r: 0, g: 0, b: 255 };   // Blue
        this.color2  = { r: 255, g: 0, b: 0 };   // Red
    }


    interpolateColors(ratio) {
        let r = Math.round((1 - ratio) * this.color1.r + ratio * this.color2.r);
        let g = Math.round((1 - ratio) * this.color1.g + ratio * this.color2.g);
        let b = Math.round((1 - ratio) * this.color1.b + ratio * this.color2.b);
      
        return { r: r, g: g, b: b };
    }

    getHexColor(color) {
        return (color.r << 16 | color.g << 8 | color.b)
    }

    updatePos(newPos) {
        this.lastPoint = new THREE.Vector3(newPos.position.x, newPos.position.y, newPos.position.z)
    }

    update() {
        

        let newPoint = new THREE.Vector3(this.obj.position.x, this.obj.position.y, this.obj.position.z)
        let intermediatePoint = new THREE.Vector3()
        if (dist3D(newPoint, this.lastPoint) > this.maxDisplacement) {
            this.lastPoint = newPoint
            return 
        }
        //console.log(this.arr.length)
        for (let i = 1; i < 10; i++) {
            let ratio = i / 9
            intermediatePoint.lerpVectors(this.lastPoint, newPoint, ratio);

            let material = new THREE.MeshBasicMaterial({
                color: 0x0000ff,
                side: THREE.DoubleSide,
            })
            let geometry = new THREE.CircleGeometry(this.dim)
            let newItem = new THREE.Mesh(geometry, material)
            // newItem.position.x = this.obj.position.x
            // newItem.position.y = this.obj.position.y
            // newItem.position.z = this.obj.position.z
            //console.log(intermediatePoint.x)
            newItem.position.x = intermediatePoint.x
            newItem.position.y = intermediatePoint.y
            newItem.position.z = intermediatePoint.z

            let direction = newItem.position.clone().add(this.game.worldObj.ballBody.velocity)
            newItem.lookAt(direction)


            this.arr.push({
                obj: newItem,
                time: new Date().getTime()
            })
            this.scene.add(newItem)


        }
        this.lastPoint = newPoint


        for (let i = this.arr.length - 1; i >= 0; i--) {
            let item = this.arr[i].obj
            let time = this.arr[i].time
            let currentTime = new Date().getTime()
            let diff = currentTime - time
            if (diff > this.timeToDisappear) {
                this.arr.splice(i, 1)
                this.scene.remove(item)
                continue
            }
            item.scale.x -= 0.04
            item.scale.y -= 0.04
            if (item.scale.x < 0)
                item.scale.x = 0
            if (item.scale.y < 0)
                item.scale.y = 0
            item.material.color.set(this.getHexColor(this.interpolateColors(item.scale.x)))
            // if (i === 0) {
            //     console.log(this.interpolateColors(item.scale.x))
            // }
        }
    }
}