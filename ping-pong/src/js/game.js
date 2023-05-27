import { Game } from "./MyObjects";


async function startGame() {

const game = new Game()
let run = true


sphereBody.addEventListener("collide", function (event) {
    const collidedBody = event.body; // The body that collided with bodyA
    if (collidedBody.id == groundBody.id){
        //console.log("Collision detected between bodyA and", collidedBody);
        sphereBody.velocity.y = -4
        //console.log(sphereBody.velocity)
    }
  });

function animate()
{

    game.hidden();

    let sphereVelocity = sphereBody.velocity
    let sphereVelocitySign = {
        x: getSign(sphereVelocity.x),
        y: getSign(sphereVelocity.y),
        z: getSign(sphereVelocity.z)
    }
    let sphereVelocityForce = {
        x: 8,
        y: 5,
        z: 1
    }

    if (sphereBody.position.y > 5) {
        sphereVelocitySign.y = -1;
    }

    sphereBody.velocity.x = sphereVelocitySign.x * sphereVelocityForce.x
    //sphere.velocity.y = sphereVelocitySign.x * sphereVelocityForce.x
    //sphereBody.velocity.y = sphereVelocitySign.y * sphereVelocityForce.y

    

    if (sphereBody.position.y <= -20) {
        sphereBody.position = new CANNON.Vec3(-12, 5, 0)
        sphereBody.velocity = new CANNON.Vec3(0, 0, 0)
    }



    renderer.render(scene, camera)
}



renderer.setAnimationLoop(animate)



}


startGame()
