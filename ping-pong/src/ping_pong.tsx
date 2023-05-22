import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

const goldMaterial = new THREE.MeshPhongMaterial({
  color: 0xffd700, // Gold color
  specular: 0xffffff, // White specular highlight
  shininess: 1000, // Adjust the shininess factor as needed
});

const cube = new THREE.Mesh(geometry, goldMaterial);
const light = new THREE.PointLight(0xffffff, 100);
light.position.set(7, 70, 100);

// Add the light source to the scene
scene.add(light);
scene.add(cube);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
