import * as THREE from 'three';

function checkWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        return !!window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
        return false;
    }
}

const canvas = document.getElementById('three-canvas');
const supportMessage = document.getElementById('support-message');
const memoryUsageDisplay = document.getElementById('memory-usage');

if (!checkWebGLSupport()) {
    supportMessage.style.display = 'block';
} else {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize, false);

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return new THREE.Color(color);
    }

    let currentColor = new THREE.Color(0x00ff00);
    let targetColor = getRandomColor();
    let transitionSpeed = 0.01;

    function animate() {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        currentColor.lerp(targetColor, transitionSpeed);
        material.color.set(currentColor);

        if (Math.abs(currentColor.r - targetColor.r) < 0.01 &&
            Math.abs(currentColor.g - targetColor.g) < 0.01 &&
            Math.abs(currentColor.b - targetColor.b) < 0.01) {
            targetColor = getRandomColor();
        }

        if (performance.memory) {
            memoryUsageDisplay.textContent = `Memory Usage: ${performance.memory.usedJSHeapSize / 1024 / 1024} MB`;
        } else {
            memoryUsageDisplay.textContent = 'Memory Usage: Not supported';
        }

        renderer.render(scene, camera);
    }

    animate();
}