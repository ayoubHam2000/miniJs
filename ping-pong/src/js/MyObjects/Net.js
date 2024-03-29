import * as THREE from 'three'

export class Net extends THREE.Object3D {

    constructor(game) {
        super()

        this.game = game
        this.scene = game.scene
        this.counter = 0

        this.planeObj = this.getObject()
        this.add(this.planeObj)
        this.scene.add(this)
    }

    getObject() {
        const planeGeo = new THREE.PlaneGeometry(18, 1.5)
        const planeMat = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide,
            wireframe: false, 
            blending: THREE.AdditiveBlending,
            opacity: 0
        })
        const planeObj = new THREE.Mesh(planeGeo, planeMat)
        planeObj.position.set(0, 0.75, 0)
        planeObj.rotation.y = 0.5 * Math.PI

        return (planeObj)
    }


    hit() {
        this.counter = 1
    }

    update() {
        //let pos = this.game.guiParams.getVal("scale", {x:0, y: 1, z: 1}, 0, 10, 0.01)
        if (this.counter === 1) {
            this.planeObj.material.opacity += 0.02
            if (this.planeObj.material.opacity > 0.2){
                this.planeObj.material.opacity = 0.2
                this.counter++
            }
        } else if (this.counter === 2) {
            this.planeObj.material.opacity -= 0.02
            if (this.planeObj.material.opacity < 0) {
                this.planeObj.material.opacity = 0
                this.counter++
            }
        } else {
            this.counter = 0
        }
    }
}