import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import Stats from 'stats.js';

let stats = new Stats();
stats.showPanel(1);
document.body.appendChild( stats.dom );

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbitControl = new OrbitControls(camera, renderer.domElement);
orbitControl.update();

const scene = new THREE.Scene();
{
  scene.background = new THREE.Color(0x55bfff)
}

camera.lookAt(0, 0, 0);
camera.position.set(30, 30, 150);

{
  const directionalLight = new THREE.DirectionalLight(0xffff77, 0.8);
  scene.add(directionalLight)
}



// plane
let planeGeometry = new THREE.PlaneGeometry(500, 500);
let planeMaterial = new THREE.MeshBasicMaterial({color: 0xffeed9, side: THREE.DoubleSide});
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotateX(-Math.PI / 2);
//
scene.add(plane);


const sphereGeometry = new THREE.SphereGeometry(100);
const sphereMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: false});
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);


// axes
const axes = new THREE.AxesHelper(500);
scene.add(axes);

let grid = new THREE.GridHelper(500, 100);
grid.material.opacity = 0.7;
grid.material.transparent = true;
scene.add(grid);


let geometry = new THREE.BufferGeometry();
let points = new Float32Array([
  50, 10, 0,
  0, 0, 50,
  -50, 0, 0,
  50, 0, 50,
]);
geometry.attributes.position = new THREE.BufferAttribute(points, 3);

let material = new THREE.MeshBasicMaterial({
  color: 0x33ff77,
  side: THREE.DoubleSide
})
let mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

const boxGeometry = new THREE.BoxGeometry(50, 50, 50);
const boxMaterial = new THREE.MeshBasicMaterial({color: '#8dff74'});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.position.set(100, 0, 0);
scene.add(box)


const gui = new dat.GUI();
const guiOptions = {
  sphereColor: '#ffffff',
  wireframe: false,
  showGrid: true
};
gui.addColor(guiOptions, 'sphereColor').onChange(e => {
  sphere.material.color.set(e);
});

gui.add(guiOptions, 'wireframe').onChange(e => {
  sphere.material.wireframe = e;
});
gui.add(guiOptions, 'showGrid').onChange(e => grid.visible = e);

function animate(time) {
  stats.begin();

  mesh.rotation.x = time / 1000;
  mesh.rotation.y = time / 1000;
  mesh.rotation.z = time / 1000;

  box.position.setY(Math.abs(Math.sin(time / 1000)) * 200)
  box.position.setX(Math.abs(Math.sin(time / 1000)) * 200)
  box.position.setZ(Math.abs(Math.sin(time / 1000)) * 200)

  renderer.render(scene, camera);
  stats.end();
}

renderer.setAnimationLoop(animate)


function generateTerrainPoints(hCount, vCount, l) {
  const pointsCount = hCount * vCount * 9;
  let points = new Float32Array(pointsCount);
  let normals = new Float32Array(pointsCount);
  let colors = new Float32Array(pointsCount);

  let i = -1;
  for (let row = 0; row < vCount; row++) {
    for (let col = 0; col < hCount; col++) {
      let ax = col * l, ay = 0, az = row * l;
      let bx = ax + l, by = 0, bz = az;
      let cx = ax, cy = 0, cz = az + l;

      points[++i] = ax;
      points[++i] = ay;
      points[++i] = az;

      points[++i] = bx;
      points[++i] = by;
      points[++i] = bz;

      points[++i] = cx;
      points[++i] = cy;
      points[++i] = cz;
    }

  }
  console.log(i);


  console.log(points);

  return points;
}
