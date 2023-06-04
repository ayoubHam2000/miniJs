import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as THREE from "three";

import wallsTextures from '../../assets/DTTC/TX_ENV_RGB_dttc_walls/TX_ENV_RGB_dttc_walls_HI.jpg'
import wallsNormalMap from '../../assets/DTTC/TX_ENV_RGB_dttc_walls/NormalMap2.png'
import floorTexture from '../../assets/DTTC/TX_ENV_RGB_dttc_floor/TX_ENV_RGB_dttc_floor_UL.jpg'
import floorNormalMap from '../../assets/DTTC/TX_ENV_RGB_dttc_floor/NormalMap2.png'

const loaderResult = {}

//Walls Texture
function tex(texture, index) {
    console.log(texture.image.width)
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
    texture.encoding = THREE.sRGBEncoding;
}

//Floor Texture
function floorText(texture) {
    texture.encoding = THREE.sRGBEncoding;
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

async function loadTextures() {
    const textureLoader = new THREE.TextureLoader()

    loaderResult.tex = {
        backWall : {
            tex : textureLoader.load(wallsTextures, (texture) => tex(texture, 0)),
            normalMap : textureLoader.load(wallsNormalMap, (texture) => tex(texture, 0))
        },
        frontWall : {
            tex : textureLoader.load(wallsTextures, (texture) => tex(texture, 2)),
            normalMap : textureLoader.load(wallsNormalMap, (texture) => tex(texture, 2))
        },
        leftWall : {
            tex: textureLoader.load(wallsTextures, (texture) => tex(texture, 3)),
            normalMap : textureLoader.load(wallsNormalMap, (texture) => tex(texture, 3))
        },
        rightWall : {
            tex: textureLoader.load(wallsTextures, (texture) => tex(texture, 1)),
            normalMap : textureLoader.load(wallsNormalMap, (texture) => tex(texture, 1))
        },
        floor : {
            tex: textureLoader.load(floorTexture, (texture) => floorText(texture)),
            normalMap : textureLoader.load(floorNormalMap, (texture) => floorText(texture))
        }
    }
}

async function load() {
    await load3dObjects()
    await loadTextures()
    console.log("Loading textures and models complete")
}

export {
    load,
    loaderResult
}
