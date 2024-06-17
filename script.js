import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.146.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.146.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.146.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, controls, spaceship;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Load spaceship model
    const loader = new GLTFLoader();
    loader.load('path/to/your/spaceship/model.glb', (gltf) => {
        spaceship = gltf.scene;
        spaceship.scale.set(0.5, 0.5, 0.5);
        scene.add(spaceship);
    }, undefined, (error) => {
        console.error(error);
    });

    // Event listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keydown', onDocumentKeyDown, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentKeyDown(event) {
    switch (event.key) {
        case 'ArrowUp':
            spaceship.position.y += 0.1;
            break;
        case 'ArrowDown':
            spaceship.position.y -= 0.1;
            break;
        case 'ArrowLeft':
            spaceship.position.x -= 0.1;
            break;
        case 'ArrowRight':
            spaceship.position.x += 0.1;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();
animate();
