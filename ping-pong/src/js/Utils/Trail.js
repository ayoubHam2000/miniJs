import * as THREE from "three";
import { params } from "./Params";


export class TrailRenderer {

    constructor(scene, obj) {
        this.scene = scene
        this.obj = obj
        this.timeToDisappear = 1
        this.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
        })
        this.arr = []
    }


    update() {
        let geometry = new THREE.CircleGeometry(params.ballDim)
        let newItem = new THREE.Mesh(geometry, this.material)
        newItem.position.x = this.obj.position.x
        newItem.position.y = this.obj.position.y
        newItem.position.z = this.obj.position.z
        this.obj.rotation.y = Math.PI / 2
        newItem.rotation.copy(this.obj.rotation)
        this.arr.unshift(newItem)
        this.scene.add(newItem)

        

        if (newItem.scale.x <= 0 || newItem.scale.y <= 0){
            this.arr.pop()
        }
        for (let item of this.arr) {
            if (item.scale.x > 0.03)
                item.scale.x -= 0.03
            if (item.scale.y > 0.03)
                item.scale.y -= 0.03
        }
    }
}