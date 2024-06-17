let scene, camera, renderer, player, boss, bullets = [], enemies = [], upgrades = [], explosions = [], controls;
let score = 0, wave = 1, enemyCount = 0, upgradesCount = 0;
let bossHealth = 100, bossMaxHealth = 100, isGameOver = false, isPaused = false;
let keys = {};
const maxUpgradesPerWave = 3;
const maxBullets = 5;
const upgradeInterval = 3;
let playerLevel = 1;
let difficulty = 'medium';
let musicPlaylist = [];
let backgroundMusic = new Audio();
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;

const saveOptions = () => {
  localStorage.setItem('gameOptions', JSON.stringify({ difficulty, musicPlaylist }));
}

const loadOptions = () => {
  const options = JSON.parse(localStorage.getItem('gameOptions'));
  if (options) {
    difficulty = options.difficulty;
    musicPlaylist = options.musicPlaylist;
    backgroundMusic.src = musicPlaylist[0];
    backgroundMusic.play();
  }
}

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

  loadOptions();
}

function createPlayer() {
  const geometry = new THREE.ConeGeometry(0.5, 1, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const player = new THREE.Mesh(geometry, material);
  player.position.y = -4;
  return player;
}

function createEnemy() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const enemy = new THREE.Mesh(geometry, material);
  enemy.position.x = Math.random() * 10 - 5;
  enemy.position.y = 5;
  enemies.push(enemy);
  scene.add(enemy);
}

function createBullet() {
  const geometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  const bullet = new THREE.Mesh(geometry, material);
  bullet.rotation.x = Math.PI / 2;
  bullet.position.set(player.position.x, player.position.y + 1, player.position.z);
  bullets.push(bullet);
  scene.add(bullet);
}

function createBoss() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  boss = new THREE.Mesh(geometry, material);
  boss.position.y = 5;
  bossHealth = bossMaxHealth;
  scene.add(boss);
}

function createUpgrade() {
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  const upgrade = new THREE.Mesh(geometry, material);
  upgrade.position.x = Math.random() * 10 - 5;
  upgrade.position.y = Math.random() * 10 - 5;
  upgrades.push(upgrade);
  scene.add(upgrade);
}

function createExplosion(x, y) {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xffa500 });
  const explosion = new THREE.Mesh(geometry, material);
  explosion.position.set(x, y, 0);
  explosions.push(explosion);
  scene.add(explosion);

  setTimeout(() => {
    scene.remove(explosion);
    explosions.splice(explosions.indexOf(explosion), 1);
  }, 500);
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

function handleUpgrades() {
  upgrades.forEach((upgrade, index) => {
    upgrade.position.y -= 0.01;
    if (upgrade.position.y < -5) {
      scene.remove(upgrade);
      upgrades.splice(index, 1);
    }

    if (upgrade.position.distanceTo(player.position) < 0.5) {
      scene.remove(upgrade);
      upgrades.splice(index, 1);
      upgradePlayer();
    }
  });
}

function upgradePlayer() {
  upgradesCount++;
  if (upgradesCount % upgradeInterval === 0 && playerLevel < 4) {
    playerLevel++;
    updatePlayerShape();
  }
}

function updatePlayerShape() {
  const geometry = new THREE.ConeGeometry(0.5 + playerLevel * 0.1, 1 + playerLevel * 0.2, 32);
  player.geometry.dispose();
  player.geometry = geometry;
}

function animate() {
  if (!isPaused) {
    requestAnimationFrame(animate);
    handlePlayerMovement();
    handleBullets();
    handleEnemies();
    handleBoss();
    handleUpgrades();
    renderer.render(scene, camera);
  }
}

function startGame() {
  document.getElementById('uiControls').style.display = 'none';
  document.getElementById('gameInfo').style.display = 'block';
  init();
  animate();
  setInterval(createEnemy, 1000);  // Create enemies every second
  setTimeout(createBoss, 30000);  // Create boss after 30 seconds
  setInterval(() => {
    if (upgrades.length < maxUpgradesPerWave) createUpgrade();
  }, 5000);
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
