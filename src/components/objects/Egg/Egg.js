import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import MODEL from './Egg.obj';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import POSX from "../../scenes/textures/Earth/posx.jpg";
import NEGX from "../../scenes/textures/Earth/negx.jpg";
import POSY from "../../scenes/textures/Earth/posy.jpg";
import NEGY from "../../scenes/textures/Earth/negy.jpg";
import POSZ from "../../scenes/textures/Earth/posz.jpg";
import NEGZ from "../../scenes/textures/Earth/negz.jpg";

class Egg extends THREE.Group {
    constructor(parent, x, y, z, texture, quote) {
        // Call parent Group() constructor
        super();

        // Init state
        this.state = {
            gui: parent.state.gui,
            bob: true,
            spin: this.spin.bind(this),
            twirl: 0,
        };
        this.x = x;
        this.y = y;
        this.z = z;
        this.mesh;

        this.name = "Egg";
        this.quote = quote;

        const textureCube = new THREE.CubeTextureLoader()
        	.load( [
                POSX, NEGX,
                POSY, NEGY,
                POSZ, NEGZ
        ] );

        textureCube.mapping = THREE.CubeRefractionMapping;
        // // args: radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength
        // const geometry = new THREE.SphereBufferGeometry(5, 32, 32, 0, 2 * Math.PI, 0, 0.5 * Math.PI);
        const geometry = new THREE.SphereBufferGeometry(0.5, 10, 10);


        // select image
        let imageID = Math.floor(Math.random() * 27);
        let imageName = "";

        if (imageID < 10) {
            imageName += "0";
        }
        imageName += imageID.toString();
        imageName += ".jpg";
        // console.log(imageName);


        const objLoader = new OBJLoader();
        // var material = new THREE.MeshPhongMaterial({
        //     color: color,
        //     // envMap: texture/\Cube, 
        //     // envMap: parent.background,
        //     // refractionRatio: 0.5,
        //     specular: 0xffffff,
        //     shininess: 10
        // });
        // material.side = THREE.DoubleSide;

        // const obj = new THREE.Mesh(geometry, material);

        // let url = '../../images/00.jpg';

        var mesh;

        
        
        objLoader.load(MODEL, obj => {
            var child = obj.children[0];
            mesh = new THREE.Mesh(child.geometry);
            mesh.scale.multiplyScalar(2);
            mesh.rotation.set(0, Math.PI/2, 0);
            
            let textureLoader = new THREE.TextureLoader();
            textureLoader.load(texture, function(tx) {
                tx.wrapS = THREE.RepeatWrapping;
                tx.wrapT = THREE.RepeatWrapping;
                tx.offset.set(0, -0.3);
				tx.repeat.set(3,3);
                tx.flipY = false;
				let stripeMaterial = new THREE.MeshPhongMaterial({
					map: tx,
					wireframe: false,
					specular: 0xffffff,
					shininess: 10,
				});
                mesh.material = stripeMaterial;
				// obj.children[0].material = stripeMaterial;
            })
            
            
            
            var pivot = new THREE.Group();
            pivot.position.set(x, y, z);
            mesh.position.set(0, 0, 0)
            // this.add(obj);
            // pivot.add(mesh);
            // mesh.add(pivot);

            this.add(pivot);
            this.add(mesh);

            this.pivot = pivot;

            this.mesh = mesh;
            this.pivot.add(this.mesh);
            this.mesh.egg = this;

            // visualiz pivot
            // var pivotSphereGeo = new THREE.SphereGeometry( 0.1 );
            // var pivotSphere = new THREE.Mesh(pivotSphereGeo);
            // pivotSphere.position.set(pivot.position.x, pivot.position.y, pivot.position.z );
            // parent.add( pivotSphere );

            // parent.add( new THREE.AxesHelper() );

            // parent.add(pivot);
        });





        // Add self to parent's update list
        parent.addToUpdateList(this);

        // Populate GUI
        // this.state.gui.add(this.state, 'bob');
        // this.state.gui.add(this.state, 'spin');
    }


    spin() {
        // Add a simple twirl
        this.state.twirl += Math.PI / 10;
    }

    jump() {
        this.state.twirl += 25 * Math.PI;
        const jumpUp = new TWEEN.Tween(this.pivot.position)
            .to({ y: this.pivot.position.y + 3 }, 1000)
            .easing(TWEEN.Easing.Quadratic.Out);
        const fallDown = new TWEEN.Tween(this.pivot.position)
            .to({ y: this.y }, 1000)
            .easing(TWEEN.Easing.Quadratic.In);

        // Fall down after jumping up
        jumpUp.onComplete(() => fallDown.start());

        // Start animation
        jumpUp.start();
    }

    stopSpin() {
        // Add a simple twirl
        this.state.twirl = 0;
        this.pivot.rotation.y = 0;
    }



    update(timeStamp) {
        // if (this.state.bob) {
        //     // Bob back and forth
        //     this.rotation.z = 0.05 * Math.sin(timeStamp / 300);
        // }
        if (this.state.twirl > 0) {
            // Lazy implementation of twirl
            this.state.twirl -= Math.PI / 8;
            this.pivot.rotation.y += Math.PI / 4;
        }

        // Advance tween animations, if any exist
        TWEEN.update();
    }
}

export default Egg;
