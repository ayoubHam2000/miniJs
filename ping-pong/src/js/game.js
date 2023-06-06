import { Game } from "./MyObjects";
import { params } from './Utils/Params'
import { load } from './Utils/Loader'
import { Ball } from "./MyObjects/Ball";
import { Racket } from "./MyObjects/Racket";
import { GameConst } from "./MyObjects/gameConst";

async function startGame() {
    await load()
    const game = new Game()

    game.gameConst = new GameConst()
    game.scene.ballObj = new Ball(game)
    game.scene.racketObj = new Racket(game)
    
    function changing1() {
        // const boxObj = game.scene.environmentSceneObj
        const light = game.scene.ambientLightObj
        
        game.scene.lightObj.position.set(3, 15, 0)
        light.intensity = params.ambientLightIntensity
        game.scene.lightObj.penumbra = params.penumbra
        game.scene.lightObj.angle = params.angle
        game.scene.lightObj.intensity = params.intensity
        game.scene.lightObj.castShadow = true
        game.scene.ballObj.castShadow = true
        game.scene.lightObjHelper.update()
        game.orbit.enabled = params.enableOrbit


        //console.log(params.width)
        //console.log(boxObj.scale)
        //console.log(camera.position, camera.rotation)
        // boxObj.scale.x = params.width
        // boxObj.scale.y = params.height
        // boxObj.scale.z = params.depth
        // boxObj.position.y = params.posY


       

        game.scene.tableModel.scale.x = params.table_width
        game.scene.tableModel.scale.y = params.table_height
        game.scene.tableModel.scale.z = params.table_depth


       
        game.scene.ballObj.update()
        game.scene.racketObj.update()
    }

    function hiddenCodeEnd() {
        if (params.frame === 0) {
            game.camera.position.x = params.vectorPos1.x;
            game.camera.position.y = params.vectorPos1.y;
            game.camera.position.z = params.vectorPos1.z;
            game.camera.rotation.x = params.vectorRot1.x;
            game.camera.rotation.y = params.vectorRot1.y;
            game.camera.rotation.z = params.vectorRot1.z;
        }
        params.frame++
        game.renderer.render(game.scene, game.camera)
    }

    function gameLoop()
    {
        changing1()
        hiddenCodeEnd()
    }


    game.renderer.setAnimationLoop(gameLoop)
}

startGame()
