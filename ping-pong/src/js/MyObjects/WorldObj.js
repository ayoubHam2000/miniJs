import * as CANNON from 'cannon-es'

export class WorldObj {
    constructor () {
        this.timeStep = 1 / 30
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9, 0)
        })


        const walls = this.#wallsBody()
        this.groundBody = this.#groundBody()
        this.upWallBody = walls.upWallBody
        this.downWallBody = walls.downWallBody
        this.leftWallBody = walls.leftWallBody
        this.rightWallBody = walls.rightWallBody
        this.racketBody = this.#racketBody
        this.ballBody = this.#ballBody
        
        this.#addToWorld()
        this.#setContactMaterial()
    }

    #addToWorld() {
        this.world.addBody(this.upWallBody)
        this.world.addBody(this.downWallBody)
        this.world.addBody(this.leftWallBody)
        this.world.addBody(this.rightWallBody)
        this.world.addBody(this.racketBody)
        this.world.addBody(this.ballBody)
    }

    #addContactMaterial(mat1, mat2, params) {
        const contactMat = new CANNON.ContactMaterial(mat1, mat2, params)
        this.world.addContactMaterial(contactMat)
    }

    #setContactMaterial() {
        this.#addContactMaterial(this.groundBody, this.sphereBody,  {restitution: 1, friction: 0})
        this.#addContactMaterial(this.upWallBody, this.sphereBody,  {restitution: 1, friction: 0})
        this.#addContactMaterial(this.downWallBody, this.sphereBody,  {restitution: 1, friction: 0})
        this.#addContactMaterial(this.leftWallBody, this.sphereBody,  {restitution: 1, friction: 0})
        this.#addContactMaterial(this.rightWallBody, this.sphereBody,  {restitution: 1, friction: 0})
        this.#addContactMaterial(this.racketBody, this.sphereBody,  {restitution: 1, friction: 0})
    }

    #groundBody() {
        const groundBodyMaterial = new CANNON.Material()
        const groundBody = new CANNON.Body({
            //shape: new CANNON.Plane(),
            shape: new CANNON.Box(new CANNON.Vec3(planeDim.x / 2, planeDim.y / 2, 0.1)),
            //mass: 1,
            type: CANNON.Body.STATIC,
            material: groundBodyMaterial
        })
        groundBody.quaternion.setFromEuler(-Math.PI / 2, 0 ,0)
        return (groundBody)
    }
    
    #wallsBody() {
        const upWallMaterial = new CANNON.Material()
        const upWallBody = new CANNON.Body({
            //shape: new CANNON.Plane(),
            shape: new CANNON.Box(new CANNON.Vec3(planeDim.x / 2, planeDim.y / 2, 0.1)),
            //mass: 1,
            type: CANNON.Body.STATIC,
            position: new CANNON.Vec3(planeDim.x / 2, 0, 0),
            material: upWallMaterial,
            
        })
        upWallBody.quaternion.setFromEuler(-Math.PI / 2, -Math.PI / 2 , 0)
        
        const downWallMaterial = new CANNON.Material()
        const downWallBody = new CANNON.Body({
            //shape: new CANNON.Plane(),
            shape: new CANNON.Box(new CANNON.Vec3(planeDim.x / 2, planeDim.y / 2, 0.1)),
            //mass: 1,
            type: CANNON.Body.STATIC,
            position: new CANNON.Vec3(-planeDim.x / 2, 0, 0),
            material: downWallMaterial
        })
        downWallBody.quaternion.setFromEuler(-Math.PI / 2, -Math.PI / 2 , 0)
        
        //======
        
        const leftWallMaterial = new CANNON.Material()
        const leftWallBody = new CANNON.Body({
            //shape: new CANNON.Plane(),
            shape: new CANNON.Box(new CANNON.Vec3(planeDim.x / 2, planeDim.y / 2, 0.1)),
            //mass: 1,
            type: CANNON.Body.STATIC,
            position: new CANNON.Vec3(0, 0, planeDim.y / 2),
            material: leftWallMaterial
        })
        leftWallBody.quaternion.setFromEuler(0, 0 , 0)
        
        const rightWallMaterial = new CANNON.Material()
        const rightWallBody = new CANNON.Body({
            //shape: new CANNON.Plane(),
            shape: new CANNON.Box(new CANNON.Vec3(planeDim.x / 2, planeDim.y / 2, 0.1)),
            //mass: 1,
            type: CANNON.Body.STATIC,
            position: new CANNON.Vec3(0, 0, -racketDim.y / 2),
            material: rightWallMaterial
        })
        rightWallBody.quaternion.setFromEuler(0, 0 , 0)

        return {
            upWallBody,
            downWallBody,
            leftWallBody,
            rightWallBody
        }
    }
    


    #racketBody() {
        const racketMaterial = new CANNON.Material()
        const racketBody = new CANNON.Body({
            //shape: new CANNON.Plane(),
            shape: new CANNON.Box(new CANNON.Vec3(racketDim.x / 2, racketDim.y / 2, 1)),
            //mass: 1,
            type: CANNON.Body.STATIC,
            position: new CANNON.Vec3(planeDim.x / 2 , 0, 0),
            material: racketMaterial
        })
        racketBody.quaternion.setFromEuler(0, -Math.PI / 2 , 0)
        return (racketBody)
    }

    
    #ballBody() {
        const spherePhysMat = new CANNON.Material();
        const sphereBody = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Sphere(sphereDim), //same
            position: new CANNON.Vec3(-12, 5, 0),
            material: spherePhysMat
        })
        sphereBody.linearDamping = 0
        // Apply force to the body
        var force = new CANNON.Vec3(300, 0, 0); // Define the force vector
        var offset = new CANNON.Vec3(0, 0, 0); // Offset from the center of mass to apply the force
        sphereBody.applyForce(force, offset);
        world.addBody(sphereBody)
        return (sphereBody)
    }





}