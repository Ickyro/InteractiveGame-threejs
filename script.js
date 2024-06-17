let scene, camera, renderer, player, boss, bullets = [], enemies = [], upgrades = [], controls;
let score = 0, wave = 1, enemyCount = 0, upgradesCount = 0;
let bossHealth = 100, bossMaxHealth = 100, isGameOver = false, isPaused = false;
let keys = {};

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  player = createPlayer();
  scene.add(player);

  camera.position.z = 5;
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
}

function createPlayer() {
  let geometry = new THREE.ConeGeometry(0.5, 1, 32);
  let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  let player = new THREE.Mesh(geometry, material);
  player.position.y = -4;
  return player;
}

function createEnemy() {
  let geometry = new THREE.BoxGeometry();
  let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  let enemy = new THREE.Mesh(geometry, material);
  enemy.position.x = Math.random() * 10 - 5;
  enemy.position.y = 5;
  enemies.push(enemy);
  scene.add(enemy);
}

function createBullet() {
  let geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);
  let material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  let bullet = new THREE.Mesh(geometry, material);
  bullet.rotation.x = Math.PI / 2;
  bullet.position.set(player.position.x, player.position.y + 1, player.position.z);
  bullets.push(bullet);
  scene.add(bullet);
}

function createBoss() {
  let geometry = new THREE.SphereGeometry(1, 32, 32);
  let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  boss = new THREE.Mesh(geometry, material);
  boss.position.y = 5;
  scene.add(boss);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(event) {
  keys[event.key] = true;
}

function onKeyUp(event) {
  keys[event.key] = false;
}

function handlePlayerMovement() {
  if (keys['ArrowLeft']) player.position.x -= 0.1;
  if (keys['ArrowRight']) player.position.x += 0.1;
  if (keys[' ']) createBullet();
}

function handleBullets() {
  bullets.forEach((bullet, index) => {
    bullet.position.y += 0.2;
    if (bullet.position.y > 5) {
      scene.remove(bullet);
      bullets.splice(index, 1);
    }
  });
}

function handleEnemies() {
  enemies.forEach((enemy, index) => {
    enemy.position.y -= 0.02;
    if (enemy.position.y < -5) {
      scene.remove(enemy);
      enemies.splice(index, 1);
      enemyCount++;
    }
  });
}

function handleBoss() {
  if (boss) {
    boss.position.x += 0.05 * (Math.random() > 0.5 ? 1 : -1);
    if (boss.position.x > 5 || boss.position.x < -5) {
      boss.position.x *= -1;
    }
  }
}

function animate() {
  if (!isPaused) {
    requestAnimationFrame(animate);
    handlePlayerMovement();
    handleBullets();
    handleEnemies();
    handleBoss();
    renderer.render(scene, camera);
  }
}

function startGame() {
  document.getElementById('uiControls').style.display = 'none';
  init();
  animate();
  setInterval(createEnemy, 1000);  // Create enemies every second
  setTimeout(createBoss, 30000);  // Create boss after 30 seconds
}

function showHighScores() {
  // Implement high scores display
}

function showTrophies() {
  // Implement trophies display
}

function showOptions() {
  // Implement options display
}

window.addEventListener('resize', onWindowResize, false);
