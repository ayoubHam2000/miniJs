import * as THREE from 'three'

export class Spot extends THREE.Object3D {
    constructor() {
        super();

        const radius = 0.5;
        const segments = 32;
        const circleGeometry = new THREE.CircleGeometry(radius, segments);


        const material = new THREE.MeshBasicMaterial({ 
            color: 0xffffffff,
            side: THREE.BackSide,
            blending: THREE.MultiplyBlending,
            opacity: 0.7
        });


        const circleMesh = new THREE.Mesh(circleGeometry, material);

        this.rotation.x = 0.5 * Math.PI
        this.position.y = 5
        this.visible = false
        this.add(circleMesh);
    }


    hit(pos) {
        this.visible = true
        this.scale.x = 1
        this.scale.y = 1
        this.children[0].material.opacity = 0.7
        this.position.set(pos.x, 0.25, pos.z)
    }

    update() {
        if (this.visible === true) {
            this.scale.x -= 0.018
            this.scale.y -= 0.018
            this.children[0].material.opacity += 0.007
            if (this.scale.x < 0.3) {
                this.visible = false
            }
        }
    }
}