/**
 * app.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also eggts the render loop and
 * handles window resizes.
 *
 */
import { WebGLRenderer, PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SeedScene } from 'scenes';
import * as THREE from 'three';

// Initialize core ThreeJS components
const scene = new SeedScene();
const camera = new PerspectiveCamera();
const renderer = new WebGLRenderer({ antialias: true });

var projector, mouse = {
    x: 0,
    y: 0
},
    INTERSECTED;

// Set up camera
camera.position.set(0, 1, 0);
camera.lookAt(new Vector3(0, 1, 0));
// camera.position.set(0, 20, 0);
// camera.lookAt(new Vector3(0, 0, 0));

// Set up renderer, canvas, and minor CSS adjustments
renderer.setPixelRatio(window.devicePixelRatio);
const canvas = renderer.domElement;
canvas.style.display = 'block'; // Removes padding below canvas
document.body.style.margin = 0; // Removes margin around page
document.body.style.overflow = 'hidden'; // Fix scrolling
document.body.appendChild(canvas);

// Set up controls
const controls = new OrbitControls(camera, canvas);
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;
controls.enableDamping = true;
// controls.enablePan = false;
// controls.minDistance = 4;
controls.maxDistance = 30;
controls.target = new Vector3(0,1,0);
controls.update();


// Render loop
const onAnimationFrameHandler = (timeStamp) => {
    controls.update();
    renderer.render(scene, camera);
    scene.update && scene.update(timeStamp);
    window.requestAnimationFrame(onAnimationFrameHandler);
    render();
};
window.requestAnimationFrame(onAnimationFrameHandler);

// Resize Handler
const windowResizeHandler = () => {
    const { innerHeight, innerWidth } = window;
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
};
windowResizeHandler();
window.addEventListener('resize', windowResizeHandler, false);

// event = keyup or keydown
document.addEventListener('keyup', event => {
    if (event.code === 'Space') {
        document.getElementById('quote').style.visibility = 'hidden';
        document.getElementById('typed').style.visibility = 'hidden';
    }
})

// prevent mouse movement from being registered on the document object
document.addEventListener('mousedown', onMouseDown, false);
document.addEventListener('mousemove', onMouseMove, false);

function onMouseDown(event) {
    event.preventDefault();
    var mouse = new THREE.Vector2();
    mouse.x = - (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.meshes);

    var matched_marker = null;
    if (intersects.length > 0) {
        intersects[0].object.egg.jump();
        let quote = intersects[0].object.egg.quote;

        setTimeout(showQuote, 2000, quote);
    }
    else {
        //$('html,body').css('cursor','cursor');
    }

    function showQuote(quote) {
        let elem = document.getElementById('quote');
        elem.innerHTML = quote;
        fade(elem);
    }
}

function fade(element) {
    element.style.opacity = 0;
    element.style.visibility = 'visible';
    var op = 0.1;  // initial opacity
    // element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1.0) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 70);
}


function onMouseMove(event) {
    // update the mouse variable
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
var raycaster = new THREE.Raycaster();
var updateObjs = [];
var colors = [];
function render() {

    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.meshes);
    if (intersects.length > 0) {
        for (let i = 0; i < intersects.length; i++) {
            let obj = intersects[i].object;
            if (!updateObjs.includes(obj)) {
                updateObjs.push(obj);
                let mat = obj.material.color;
                colors.push(new THREE.Color(mat.r, mat.g, mat.b));
            }

            obj.material.color.set(0xffffff);
            let egg = intersects[i].object.egg;
            egg.spin();
        }
    }
    else {
        for (let i = updateObjs.length - 1; i >= 0; i--) {
            updateObjs[i].material.color.set(colors[i]);
            updateObjs.pop();
            colors.pop();
        }
    }

    renderer.render(scene, camera);

}