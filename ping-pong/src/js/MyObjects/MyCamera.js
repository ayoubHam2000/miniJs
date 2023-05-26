import * as THREE from "three";


export class MyCamera extends THREE.PerspectiveCamera {
    
    constructor() {
        super(45,
            window.innerWidth / window.innerHeight,
            0.01,
            1000)
    }


    setCameraPosition() {
        this.position.set(2, 2, 2)
    }
    
    setCameraRotation() {
        this.position.set(2, 2, 2)
    }

}

