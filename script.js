const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

document.body.appendChild(VRButton.createButton(renderer));

renderer.xr.enabled = true;
renderer.shadowMap.enabled = true;

const groundMaterial = new THREE.MeshStandardMaterial( { color: 0x7f7f0f });
const groundGeometry = new THREE.PlaneBufferGeometry(10000, 10000);
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.position.y = 0.0;
groundMesh.rotation.x = - Math.PI / 2;
groundMesh.receiveShadow = true;
scene.add(groundMesh);

const cylinderMaterial = new THREE.MeshStandardMaterial( { color: 0x7f7f7f, side: THREE.BackSide });
const cylinderGeometry = new THREE.CylinderGeometry(15, 15, 200, 100, 1, true);
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinderMesh.receiveShadow = true;
cylinderMesh.position.set(0, 0, 0);
scene.add(cylinderMesh);

const light = new THREE.SpotLight(0xffffff, 1, 100);
light.position.y = 30;
light.position.z = 20;
light.position.x = 10;
light.castShadow = true;
scene.add(light);

camera.position.y = 2;

const geometry = new THREE.BoxGeometry();

const cubeCount = 20;
const diameter = 10;
const height = 10;
const cubes = [];
for (let ix = 0; ix < cubeCount; ix++) {
    const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    const x = Math.sin(2 * Math.PI * ix / cubeCount) * diameter;
    const z = Math.cos(2 * Math.PI * ix / cubeCount) * diameter;
    cube.position.set(x, 0, z);
    cube.scale.y = height;
    cube.scale.x = 0.5;
    cube.rotation.y = 8 * Math.PI * ix / cubeCount;
    cube.castShadow = true;
    scene.add(cube);
    cubes.push(cube);
}

const colorSet = [0x00ff00, 0x0000ff, 0xff0000];

let ix = 1;
let delay = 0;
let colorIx = 0;
renderer.setAnimationLoop(function() {
    if (delay == 5) {
        cubes[ix == 0 ? cubeCount - 1 : ix - 1].scale.y = height * 0.9;
        cubes[ix].scale.y = height * 0.8;
        cubes[ix == cubeCount - 1 ? 0 : ix + 1].scale.y = height * 0.9;
        renderer.render(scene, camera);

        cubes[ix].material.color.setHex(colorSet[colorIx]);

        ix++;
        if (ix == cubeCount) { 
            ix = 0;
            colorIx++;
            if (colorIx >= colorSet.length) colorIx = 0; 
        }
        delay = 0;
    }
    delay++;
});
