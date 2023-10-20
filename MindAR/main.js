import * as THREE from './Libs/three/three.module.js';
import WebGL from './Libs/three/addons/capabilities/WebGL.js';
import { MindARThree } from './Libs/MindAR/mindar-image-three.prod.js';
import { FBXLoader } from './Libs/three/addons/loaders/FBXLoader.js';

//#region Main

window.onload = () => {
    if (WebGL.isWebGLAvailable()) {
        Init();
        Animate();
    }
    else {
        // Show WebGL error
        document.body.appendChild(WebGL.getWebGLErrorMessage());
    }
}

function Init() {
    InitMindAR();
    InitScene();
    InitUI();
};

function Animate() {
    requestAnimationFrame(Animate);
    Render();
    UpdateUI();
};

//#endregion

const _Clock = new THREE.Clock();

//#region UI

var _UIContainer;
var _FPSUI;

function InitUI() {
    // Container :

    _UIContainer = document.createElement("div");

    _UIContainer.id = "UI Container";

    document.body.appendChild(_UIContainer);

    // FPS :

    _FPSUI = document.createElement("div");

    _FPSUI.style.color = "white";
    _FPSUI.style.fontSize = "50px";

    _UIContainer.appendChild(_FPSUI);
}

function UpdateUI() {
    _FPSUI.textContent = (1 / _Clock.getDelta()).toFixed();
}

//#endregion

//#region AR

var _Scene, _Camera, _Renderer;
var _Anchor0;

const _TargetURL = "Assets/targets_card.mind";

const _FBXLoader = new FBXLoader();

async function InitMindAR() {
    var _MindAR = new MindARThree({
        container: document.getElementById("MindAR-Container"),
        imageTargetSrc: _TargetURL
    });

    _Scene = _MindAR.scene;
    _Camera = _MindAR.camera;
    _Renderer = _MindAR.renderer;

    _Anchor0 = _MindAR.addAnchor(0);

    await _MindAR.start();
}

function InitScene() {
    // Box :

    // const _BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
    // const _BoxMaterial = new THREE.MeshBasicMaterial({
    //     color: "white",
    //     transparent: true,
    //     opacity: 0.5
    // });
    // const _Box = new THREE.Mesh(_BoxGeometry, _BoxMaterial);
    
    // _Anchor0.group.add(_Box);

    // FBX :
    _FBXLoader.load(
        "Assets/Cactus.fbx",
        (_Model) =>
        {
            console.log(_Model);
            _Model.position.set(0, 0, 0);
            _Model.scale.set(0.01, 0.01, 0.01);
            _Anchor0.group.add(_Model);
        });

    // Lights :
    const _Light = new THREE.AmbientLight("white", 0.5);
    _Anchor0.group.add(_Light);

    // Button : To DAYOU website.
}

function Render() {
    _Renderer.render(_Scene, _Camera);
}

//#endregion