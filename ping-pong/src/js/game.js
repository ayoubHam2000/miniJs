import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import * as CANNON from 'cannon-es'
//dev
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from 'dat.gui'


function setUpRenderer() {
    const renderer = new THREE.WebGLRenderer()
    renderer.shadowMap.enabled = true; // Enable shadow map rendering
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Type of shadow map
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    
    const documentRoot = document.getElementById("root")
    documentRoot?.appendChild(renderer.domElement)
    return renderer
}

async function Game() {
    const mousePosition = new THREE.Vector2()
    const renderer = setUpRenderer()
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    )

    function helpers() {
        const gui = new dat.GUI()
    
        const options = {
            sphereColor: "#00ff00",
            wireFrame: false,
            speed: 0.01,
            penumbra: 0,
            intensity: 1,
            angle: 0.2
        }
    
        gui.addColor(options, 'sphereColor').onChange((e) => {
            sphere.material.color.set(e)
        })
    
        gui.add(options, 'wireFrame').onChange((e) => {
            sphere.material.wireframe = e
        })
    
        gui.add(options, 'speed', 0, 1, 0.01);
        gui.add(options, 'penumbra', 0, 5, 0.01);
        gui.add(options, 'intensity', 0, 5, 0.01);
        gui.add(options, 'angle', 0, 1, 0.01);
    
        const orbit = new OrbitControls(camera, renderer.domElement)
    
        const axesHelper = new THREE.AxesHelper(10)
        scene.add(axesHelper)
    
        const gridHelper = new THREE.GridHelper()
        scene.add(gridHelper)
    
        camera.position.set(-10, 30, 30)
        orbit.update()
        return options
    }
    const options = helpers()

    function events() {
        window.addEventListener('resize', function() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        window.addEventListener('mousemove', function(e) {
            mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
            mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
            //console.log(mousePosition.x, mousePosition.y)
        })
    }


    //==============================================

    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(-50, 50, 0)
    spotLight.castShadow = true
    spotLight.angle = 0.2
    scene.add(spotLight)
    const sLightHelper = new THREE.SpotLightHelper(spotLight)
    scene.add(sLightHelper)

    const monkeyUrl = new URL('../assets/tennis_racket_wilson_blade.glb', import.meta.url)
    const assetLoader = new GLTFLoader()
    let racketModel = undefined
    assetLoader.load(monkeyUrl.href, (gltf) => {
        const model = gltf.scene
        scene.add(model)
        model.position.set(0, 0, 0)
        model.scale.set(1, 1, 1)
    }, undefined, (errors) => {
        console.log(errors)
    })

    function animate()
    {
        if (scene?.children[4])
            scene.children[4].position.y += 0.1
        //racketModel?.position?.y += 0.01
        spotLight.penumbra = options.penumbra
        spotLight.angle = options.angle
        spotLight.intensity = options.intensity
        sLightHelper.update()
        
        renderer.render(scene, camera)
    }

    events()
    
    renderer.setAnimationLoop(animate)
}

Game()