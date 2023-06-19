import * as THREE from "three";
import { params } from '../Utils/Params'
import { dist3D } from "../Utils/Utils"


export class TrailRenderer {

    constructor(game, obj) {
        this.game = game
        this.scene = game.scene
        this.obj = obj
        this.timeToDisappear = 300
        this.arr = []
        this.stack = []
        this.lastPoint = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z)
        this.dim = params.ballDim
        this.maxDisplacement = 3
        this.color1 = { r: 0, g: 0, b: 255 };   // Blue
        this.color2  = { r: 255, g: 0, b: 0 };   // Red
        this.stop = false
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


    setItem(pos) {
        let newItem = undefined
        if (this.stack.length) {
            newItem = this.stack[this.stack.length - 1]
            this.stack.pop()
        } else {
            let material = new THREE.MeshBasicMaterial({
                color: 0x0000ff,
                side: THREE.DoubleSide,
            })
            let geometry = new THREE.CircleGeometry(this.dim)
            newItem = new THREE.Mesh(geometry, material)
            newItem.time = 0
            this.arr.push(newItem)
            this.scene.add(newItem)
        }
        newItem.position.x = pos.x
        newItem.position.y = pos.y
        newItem.position.z = pos.z
        newItem.scale.x = 1
        newItem.scale.y = 1
        newItem.visible = true
        newItem.time = performance.now()
        let direction = newItem.position.clone().add(this.obj.velocity)
        newItem.lookAt(direction)
        return (newItem)
    }

    update() {
        

        if (!this.stop) {
            let newPoint = new THREE.Vector3(this.obj.position.x, this.obj.position.y, this.obj.position.z)
            let intermediatePoint = new THREE.Vector3()
            if (dist3D(newPoint, this.lastPoint) > this.maxDisplacement) {
                this.lastPoint = newPoint
                return 
            }
            for (let i = 1; i < 10; i++) {
                let ratio = i / 9
                intermediatePoint.lerpVectors(this.lastPoint, newPoint, ratio);
                this.setItem(intermediatePoint)
            }
            // console.log(this.stack.length)
            this.lastPoint = newPoint
        }


        for (let i = this.arr.length - 1; i >= 0; i--) {
            let item = this.arr[i]
            let currentTime = performance.now()
            let diff = currentTime - item.time
            if (diff <= this.timeToDisappear) {
                item.scale.x -= 0.04
                item.scale.y -= 0.04
                if (item.scale.x < 0)
                    item.scale.x = 0
                if (item.scale.y < 0)
                    item.scale.y = 0
                item.material.color.set(this.getHexColor(this.interpolateColors(item.scale.x)))
            } else if (item.visible) {
                item.visible = false
                this.stack.push(item)
            }
            
        }
    }
}