let scene, camera, renderer, controls, player, obstacles = [], gravity = 9.8;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false, jump = false;

function init() {
    // Initialisation de la scène, de la caméra et du renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game').appendChild(renderer.domElement);

    // Lumière
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 7.5);
    scene.add(light);

    // Plane
    const planeGeometry = new THREE.PlaneGeometry(200, 200);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = - Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane);

    // Joueur
    const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 1;
    scene.add(player);

    // Obstacles
    for (let i = 0; i < 10; i++) {
        const obstacleGeometry = new THREE.BoxGeometry(2, 2, 2);
        const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        obstacle.position.set(
            Math.random() * 100 - 50,
            1,
            Math.random() * 100 - 50
        );
        scene.add(obstacle);
        obstacles.push(obstacle);
    }

    camera.position.set(0, 10, 10);
    camera.lookAt(player.position);

    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 87: // W
            moveForward = true;
            break;
        case 83: // S
            moveBackward = true;
            break;
        case 65: // A
            moveLeft = true;
            break;
        case 68: // D
            moveRight = true;
            break;
        case 32: // Space
            jump = true;
            break;
    }
}

function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 87: // W
            moveForward = false;
            break;
        case 83: // S
            moveBackward = false;
            break;
        case 65: // A
            moveLeft = false;
            break;
        case 68: // D
            moveRight = false;
            break;
        case 32: // Space
            jump = false;
            break;
    }
}

function animate() {
    requestAnimationFrame(animate);

    let delta = 0.1;
    if (moveForward) player.position.z -= delta;
    if (moveBackward) player.position.z += delta;
    if (moveLeft) player.position.x -= delta;
    if (moveRight) player.position.x += delta;
    if (jump) player.position.y += delta;
    player.position.y -= gravity * delta * 0.1; // Apply gravity

    obstacles.forEach(obstacle => {
        if (player.position.distanceTo(obstacle.position) < 1.5) {
            // Collision detected, reset player position
            player.position.set(0, 1, 0);
        }
    });

    renderer.render(scene, camera);
}

function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('options').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    init();
    animate();
}

function showOptions() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('options').style.display = 'block';
}

function hideOptions() {
    document.getElementById('options').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
}

function applyOptions() {
    gravity = parseFloat(document.getElementById('gravity').value);
    hideOptions();
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
