import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
import * as THREE from 'three';
import { Egg } from 'objects';
import { BasicLights } from 'lights';
import Images from '../images/Images';
import POSX from "./textures/Earth/posx.jpg";
import NEGX from "./textures/Earth/negx.jpg";
import POSY from "./textures/Earth/posy.jpg";
import NEGY from "./textures/Earth/negy.jpg";
import POSZ from "./textures/Earth/posz.jpg";
import NEGZ from "./textures/Earth/negz.jpg";

const RED = 0xff8e88;
const ORANGE = 0xFF8161;
const YELLOW = 0xffe983;
const GREEN = 0x77dd77;
const GREEN0 = 0xC5EFC2;
const BLUE = 0x0da2ff;
const BLUE0 = 0xC2ECEF;
const INDIGO = 0x6666ff;
const VIOLET = 0x9966ff;
const VIOLET0 = 0x9359DF;
const GREY = 0xffffff;
const PINK = 0xFF61A9;
const quotes = [
    "the way the corners of your eyes crinkle when you smile",
    "*",
    "*",
    "*",
    "*",
    "*",
    "*",
    "*",
    "*",
    "*",
    "*",
    "*",
];

class SeedScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            // gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 1,
            updateList: [],
        };
        this.meshes = [];

        // console.log(Images);


        // Set background to a nice color
        // this.background = new Color(0xFFCCC0);
        // this.background = new Color(0xFFA2A7);
        // this.background = new Color(0xB2DC8D);
        // this.background = new Color(0xFFB5C3);
        this.background = new Color(0x000000);

        // this.background = new THREE.CubeTextureLoader()
		// 	.load( [
        //         POSX, NEGX,
        //         POSY, NEGY,
        //         POSZ, NEGZ
        // ] );

        // 5 14
        // 9

        let imageList = this.getImages();

        let scale = 5;
        let sin30 = scale * Math.sin(Math.PI/6);
        let sin60 = scale * Math.sin(Math.PI/3);

        const lights = new BasicLights();
        this.add(lights);

        // N
        const Egg0 = new Egg(this, 0, 0, -scale, imageList[0], quotes[0]);
        setTimeout(addEgg, 1000, this, Egg0);

        const Egg1 = new Egg(this, sin30, 0, -sin60, imageList[1], quotes[1]);
        setTimeout(addEgg, 1000, this, Egg1);

        const Egg2 = new Egg(this, sin60, 0, -sin30, imageList[2], quotes[2]);
        setTimeout(addEgg, 1000, this, Egg2);

        // E
        const Egg3 = new Egg(this, scale, 0, 0, imageList[3], quotes[3]);
        setTimeout(addEgg, 1000, this, Egg3);

        const Egg4 = new Egg(this, sin60, 0, sin30, imageList[4], quotes[4]);
        setTimeout(addEgg, 1000, this, Egg4);

        const Egg5 = new Egg(this, sin30, 0, sin60, imageList[5], quotes[5]);
        setTimeout(addEgg, 1000, this, Egg5);

        // S
        const Egg6 = new Egg(this, 0, 0, scale, imageList[6], quotes[6]);
        setTimeout(addEgg, 1000, this, Egg6);

        const Egg7 = new Egg(this, -sin30, 0, sin60, imageList[7], quotes[7]);
        setTimeout(addEgg, 1000, this, Egg7);

        const Egg8 = new Egg(this, -sin60, 0, sin30, imageList[8], quotes[8]);
        setTimeout(addEgg, 1000, this, Egg8);

        // W
        const Egg9 = new Egg(this, -scale, 0, 0, imageList[9], quotes[9]);
        setTimeout(addEgg, 1000, this, Egg9);

        const Egg10 = new Egg(this, -sin60, 0, -sin30, imageList[10], quotes[10]);
        setTimeout(addEgg, 1000, this, Egg10);

        const Egg11 = new Egg(this, -sin30, 0, -sin60, imageList[11], quotes[11]);
        setTimeout(addEgg, 1000, this, Egg11);

        function addEgg(scene, s) {
            scene.add(s);
            scene.meshes.push(s.mesh);
        }
    }

    getImages() {
        let count = 0;
        let len = Images.length;
        let id;
        let idList = [];
        let imageList = [];
        while (count < 12) {
            id = Math.floor(Math.random() * len);
            if (!idList.includes(id)) {
                idList.push(id);
                imageList.push(Images[id]);
                count += 1;
            }
        }
        return imageList;
    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        // this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }
    }
}

export default SeedScene;
