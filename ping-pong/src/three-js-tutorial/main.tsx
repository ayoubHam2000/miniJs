import * as THREE from "three";

export function Launcher()
{
    const rendrer = new THREE.WebGLRenderer()
    
    rendrer.setSize(window.innerWidth, window.innerHeight)
    
    const documentRoot = document.getElementById("root")
    documentRoot?.appendChild(rendrer.domElement)
    
    const scene = new THREE.Scene()
    
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
    )
    
    const axesHelper = new THREE.AxesHelper(10)
    
    camera.position.set(0, 10, 10)
    
    scene.add(axesHelper)
    rendrer.render(scene, camera)
} 
