import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from "three";

import wallsTextures from '../../assets/DTTC/TX_ENV_RGB_dttc_walls/TX_ENV_RGB_dttc_walls_HI.jpg'
import wallsNormalMap from '../../assets/DTTC/TX_ENV_RGB_dttc_walls/NormalMap2.png'
import floorTexture from '../../assets/DTTC/TX_ENV_RGB_dttc_floor/TX_ENV_RGB_dttc_floor_UL.jpg'
import floorNormalMap from '../../assets/DTTC/TX_ENV_RGB_dttc_floor/NormalMap2.png'
import { params } from './Params';

const loaderResult = {}

//Walls Texture
function tex(texture, index) {
    const spriteSize = new THREE.Vector2(texture.image.width, texture.image.width / 4); // Size of each sprite

    // Calculate the sprite's UV coordinates based on its index
    const spriteIndex = index; // Index of the sprite you want to load
    const rowSize = texture.image.width / spriteSize.x;
    const column = Math.floor(spriteIndex / rowSize);
    const row = spriteIndex % rowSize;

    const spriteWidth = 1 / rowSize;
    const spriteHeight = 1 / (texture.image.height / spriteSize.y);

    // Create a texture region for the specific sprite
    texture.offset.set(row * spriteWidth, column * spriteHeight);
    texture.repeat.set(spriteWidth, spriteHeight);
    texture.colorSpace = THREE.SRGBColorSpace;
    return (texture)
}

//Floor Texture
function floorText(texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    return (texture)
}

//===================================
//===================================
//===================================

async function load3dObjects() {
    const assetLoader = new GLTFLoader()
    
    const tableUrl = new URL('../../assets/table_tennis_table.glb', import.meta.url)
    const racketUrl = new URL('../../assets/raqueta_de_ping_pong.glb', import.meta.url)

    loaderResult.models = {
        table : await assetLoader.loadAsync(tableUrl.href),
        racket : await assetLoader.loadAsync(racketUrl.href)
    }
}

function loadTexture(url) {
    return new Promise((resolve, reject) => {
      const textureLoader = new THREE.TextureLoader();
  
      textureLoader.load(
        url,
        resolve, // Resolve the promise when the texture is loaded
        undefined, // No progress callback
        reject // Reject the promise if there is an error
      );
    });
  }

 
async function loadTextures() {

    //const textures = await Promise.all(texturePromises);
    const textureUrls = [
        wallsTextures,
        wallsNormalMap,
        floorTexture,
        floorNormalMap
    ];
    const textures = await Promise.all(textureUrls.map((url) => loadTexture(url)))

    loaderResult.tex = {
        backWall : {
            tex :  tex(textures[0].clone(), 0),
            normalMap : tex(textures[1].clone(), 0),
        },
        frontWall : {
            tex : tex(textures[0].clone(), 2),
            normalMap : tex(textures[1].clone(), 2),
        },
        leftWall : {
            tex: tex(textures[0].clone(), 3),
            normalMap : tex(textures[1].clone(), 3),
        },
        rightWall : {
            tex: tex(textures[0].clone(), 1),
            normalMap : tex(textures[1].clone(), 1),
        },
        floor : {
            tex: floorText(textures[2]),
            normalMap : floorText(textures[3]),
        }
    }
}

async function load() {
    await load3dObjects()
    if (params.loadTex)
        await loadTextures()
    console.log("Loading textures and models complete")
}

export {
    load,
    loaderResult
}
