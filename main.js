let scene, camera, renderer, controls;
let objects = [];
let audioLoader, listener, sound;

function init() {
    // Initialisation de la scène, de la caméra et du renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('game').appendChild(renderer.domElement);

    // Lumière
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(10, 10, 10);
    scene.add(light);

    // Formes complexes
    const geometry1 = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material1 = new THREE.MeshStandardMaterial({ color: 0xff6347 });
    const torusKnot = new THREE.Mesh(geometry1, material1);
    scene.add(torusKnot);
    objects.push(torusKnot);

    const geometry2 = new THREE.DodecahedronGeometry(5);
    const material2 = new THREE.MeshStandardMaterial({ color: 0x4682b4 });
    const dodecahedron = new THREE.Mesh(geometry2, material2);
    dodecahedron.position.set(20, 0, 0);
    scene.add(dodecahedron);
    objects.push(dodecahedron);

    // Audio
    listener = new THREE.AudioListener();
    camera.add(listener);
    sound = new THREE.Audio(listener);
    audioLoader = new THREE.AudioLoader();

    camera.position.z = 50;
}

function animate() {
    requestAnimationFrame(animate);
    objects.forEach(obj => {
        obj.rotation.x += 0.01;
        obj.rotation.y += 0.01;
    });
    renderer.render(scene, camera);
}

function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    init();
    animate();
}

function playMusic() {
    const file = document.getElementById('musicUpload').files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const audioData = e.target.result;
            audioLoader.load(audioData, function (buffer) {
                sound.setBuffer(buffer);
                sound.setLoop(true);
                sound.setVolume(0.5);
                sound.play();
            });
        };
        reader.readAsArrayBuffer(file);
    }
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
