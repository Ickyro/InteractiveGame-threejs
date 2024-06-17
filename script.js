import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

let scene, camera, renderer;
let player, playerControls;
let enemies = [];
let score = 0, wave = 1, enemiesDestroyed = 0;

function init() {
  // Initialisation de la scène, caméra et renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lumière
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 1, 1).normalize();
  scene.add(light);

  // Initialisation du joueur
  const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
  const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  player = new THREE.Mesh(playerGeometry, playerMaterial);
  scene.add(player);

  // Contrôles du joueur
  playerControls = {
    forward: false,
    backward: false,
    left: false,
    right: false
  };

  // Initialisation des éléments de décor
  addEnvironmentElements();

  // Initialisation des ennemis
  spawnEnemies();

  camera.position.z = 5;

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  animate();
}

function addEnvironmentElements() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x808080 });
  for (let i = 0; i < 20; i++) {
    const box = new THREE.Mesh(geometry, material);
    box.position.set(Math.random() * 20 - 10, 0.5, Math.random() * 20 - 10);
    scene.add(box);
  }
}

function spawnEnemies() {
  const enemyGeometry = new THREE.SphereGeometry(0.5, 32, 32);
  const enemyMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  for (let i = 0; i < 10; i++) {
    const enemy = new THREE.Mesh(enemyGeometry, enemyMaterial);
    enemy.position.set(Math.random() * 20 - 10, 0.5, Math.random() * 20 - 10);
    enemies.push(enemy);
    scene.add(enemy);
  }
}

function onKeyDown(event) {
  switch (event.keyCode) {
    case 87: // W
      playerControls.forward = true;
      break;
    case 83: // S
      playerControls.backward = true;
      break;
    case 65: // A
      playerControls.left = true;
      break;
    case 68: // D
      playerControls.right = true;
      break;
  }
}

function onKeyUp(event) {
  switch (event.keyCode) {
    case 87: // W
      playerControls.forward = false;
      break;
    case 83: // S
      playerControls.backward = false;
      break;
    case 65: // A
      playerControls.left = false;
      break;
    case 68: // D
      playerControls.right = false;
      break;
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Contrôles du joueur
  if (playerControls.forward) player.position.z -= 0.1;
  if (playerControls.backward) player.position.z += 0.1;
  if (playerControls.left) player.position.x -= 0.1;
  if (playerControls.right) player.position.x += 0.1;

  // Mettre à jour la position de la caméra
  camera.position.x = player.position.x;
  camera.position.y = player.position.y + 2;
  camera.position.z = player.position.z + 5;
  camera.lookAt(player.position);

  renderer.render(scene, camera);
}

function startGame() {
  document.getElementById('uiControls').style.display = 'none';
  document.getElementById('gameInfo').style.display = 'block';
  init();
}

function showHighScores() {
  // Afficher les meilleurs scores
}

function showTrophies() {
  // Afficher les trophées
}

function showOptions() {
  // Afficher les options
}

window.startGame = startGame;

