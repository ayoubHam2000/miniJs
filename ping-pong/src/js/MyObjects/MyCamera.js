import * as THREE from "three";


export class MyCamera extends THREE.PerspectiveCamera {
    
    constructor(x = 0, y = 0, z = 0) {
        super(45,
            window.innerWidth / window.innerHeight,
            0.01,
            1000)

        this.position.set(x, y, z)
    }


    setCameraPosition() {
        this.position.set(2, 2, 2)
    }
    
    setCameraRotation() {
        this.position.set(2, 2, 2)
    }

}

