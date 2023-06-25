import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import * as dat from 'dat.gui'



const params = {
  enableOrbit : true
}


async function load3dObjects() {
  const assetLoader = new GLTFLoader()
  
  const tableUrl = new URL('../img/table_tennis_table.glb', import.meta.url)

  return {
      table : await assetLoader.loadAsync(tableUrl.href)
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

class GuiParams {
    constructor() {
        this.isExist = {}
        this.gui = new dat.GUI()
        //dat.GUI.toggleHide();
        
        this.setUp()
    }

    setUp() {
        this.gui.add(params, 'enableOrbit');
    }


    //let pos = this.game.guiParams.getVal("psss", {x:0, y:2, z:0}, -2, 4, 0.001)
    getVal(name, dic, min = 0, max = 100, step = 1) {
        if (!name)
            return

        if (!this.isExist[name]){
            const newFolder = this.gui.addFolder(name);
            newFolder.open()
            for (let item in dic)
                newFolder.add(dic, item, min, max).step(step)
            this.isExist[name] = dic
        }
        return (this.isExist[name])
    }
}

//########################################################
//########################################################
//########################################################

const vertexShader = `
uniform vec3 viewVector;
uniform float c;
uniform float p;
varying float intensity;
void main() 
{
    vec3 vNormal = normalize( normalMatrix * normal );
    vec3 vNormel = normalize( normalMatrix * viewVector );
    intensity = pow( c - dot(vNormal, vNormel), p );

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
const fragmentShader = `
uniform vec3 glowColor;
varying float intensity;
void main() 
{
\tvec3 glow = glowColor * intensity;
    gl_FragColor = vec4( glow, 1.0 );
}
`
let test_mat;

const glowShader = new THREE.ShaderMaterial({
  uniforms: {
    intensity: { value: 0.1 }, // Control the intensity of the glow
    glowColor: { value: new THREE.Color(0x00ff00) } // Control the color of the glow
  },
  vertexShader: `
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float intensity;
    uniform vec3 glowColor;

    void main() {
      vec3 glow = glowColor * intensity;
      gl_FragColor = vec4(glow, 1.0);
    }
  `,
  side: THREE.FrontSide, // Render only the front side of the mesh
  blending: THREE.AdditiveBlending, // Additive blending for the glow effect
  transparent: true // Enable transparency for the glow effect
});

const makeGlow = (camera) => {
  const customMaterial = new THREE.ShaderMaterial( 
	{
	    uniforms: 
		{ 
			"c":   { type: "f", value: 0.2 },
			"p":   { type: "f", value: 1.9 },
			glowColor: { type: "c", value: new THREE.Color(0xdddd00) },
			viewVector: { type: "v3", value: camera.position },
      "intensity" : { type: "f", value: 20.0 },
		},
		vertexShader: vertexShader  ,
		fragmentShader: fragmentShader,
		side: THREE.FrontSide,
		blending: THREE.AdditiveBlending,
		transparent: true
	}   );

  test_mat = customMaterial

  let mat  = new THREE.MeshStandardMaterial ({
    color: 0xff0000,
    side: THREE.DoubleSide,
  })
  
  let sphereGeom = new THREE.SphereGeometry(
      1,
      50,
      16)
		
	let moonGlow = new THREE.Mesh( sphereGeom.clone(), glowShader.clone() );
	//let moonGlow = new THREE.Mesh( sphereGeom.clone(), mat.clone() );
  
  moonGlow.position.y = 2;
	//moonGlow.scale.multiplyScalar(1.4);
  
  return moonGlow;
}

//########################################################
//########################################################
//########################################################


async function startGame() {
  //global declaration
  let scene;
  let camera;
  let renderer;


  let models = await load3dObjects()
  //const canvas = document.getElementsByTagName("canvas")[0];
  scene = new THREE.Scene();
  const fov = 60;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;

  //camera
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 8;
  camera.position.x = 0;
  camera.position.y = 5;
  scene.add(camera);

  //default renderer
  renderer = new THREE.WebGLRenderer({
    //canvas: canvas,
    antialias: true,
  });
  const documentRoot = document.getElementById("root")
  documentRoot?.appendChild(renderer.domElement)

  const orbit = new OrbitControls(camera, renderer.domElement)
  const gui = new GuiParams()


  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);


  
  //########################################################
  //########################################################
  //########################################################

  
  const glowObject = makeGlow(camera)
  scene.add(glowObject)


  models.table.scene.traverse((node) => {
    if (node.isMesh) {
      if (node.name === "Object_5") {
        console.log(node)
        node.material = glowShader
      }
    }
  });

  scene.add(models.table.scene)

  const ambientlight = new THREE.AmbientLight(0xffffff, 10);
  //ambientlight.layers.set(1)
  scene.add(ambientlight);

  


  //########################################################
  //########################################################
  //########################################################

  //resize listner
  window.addEventListener(
    "resize",
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
  );

  //animation loop
  const animate = () => {
    orbit.enabled = params.enableOrbit
    requestAnimationFrame(animate);

    //let p = gui.getVal("pos", {threshold: 1, strength:2, radius:0}, -20, 20, 0.1)
   
    renderer.render(scene, camera)
  };

  animate();
}



export default startGame