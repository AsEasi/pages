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
    // InitMindAR();
    // InitScene();
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

const _UIContainer = document.getElementById("OverlayUI-Container");
const _ButtonContainer = document.getElementById("SelectionButtons");
var _FPSUI;

function InitUI() {
    // FPS :

    _FPSUI = document.createElement("div");

    _FPSUI.style.color = "white";
    _FPSUI.style.fontSize = "50px";
    _FPSUI.style.display = "flex";
    _FPSUI.style.justifyContent = "center";
    _FPSUI.style.opacity = 0.25;

    _UIContainer.appendChild(_FPSUI);

    // Buttons :

    document.getElementById("Button:Chicken").onclick = ChickenSelected;
    document.getElementById("Button:Cherry").onclick = CherrySelected;
    document.getElementById("Button:Cactus").onclick = CactusSelected;
}

function SetSelectionButtonsVisible(_Visible = true) {
    if (_Visible) {
        _ButtonContainer.style.visibility = "visible";
    }
    else {
        _ButtonContainer.style.visibility = "hidden";
    }
}

function UpdateUI() {
    _FPSUI.textContent = (1 / _Clock.getDelta()).toFixed();
}

//#endregion

//#region AR

var _Scene, _Camera, _Renderer;
var _Anchor0;

var _Render = false;

const _MindARContainer = document.getElementById("MindAR-Container");
var _TargetURL = "Assets/Target_House.mind";

const _FBXLoader = new FBXLoader();

var _TargetModelName = "None";

async function InitMindAR() {
    var _MindAR = new MindARThree({
        container: _MindARContainer,
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

    // Clear array.
    // _Anchor0.group.children.length = 0;

    // Load model.
    switch (_TargetModelName) {
        case "Chicken":
            {
                _FBXLoader.load(
                    "Assets/Chicken.fbx",
                    (_ModelObject) =>
                    {
                        console.log(_ModelObject);
                        _ModelObject.position.set(0, 0, 0);
                        _ModelObject.scale.set(0.003, 0.003, 0.003);
                        _Anchor0.group.add(_ModelObject);
                    });
                break;
            }
        case "Cherry":
            {
                _FBXLoader.load(
                    "Assets/Cherry.fbx",
                    (_ModelObject) =>
                    {
                        console.log(_ModelObject);
                        _ModelObject.position.set(0, 0, 0);
                        _ModelObject.scale.set(0.002, 0.002, 0.002);
                        _ModelObject.rotation.set(0, - Math.PI / 2, 0);
                        _Anchor0.group.add(_ModelObject);
                    });
                break;
            }
        case "Cactus":
            {
                _FBXLoader.load(
                    "Assets/Cactus.fbx",
                    (_ModelObject) =>
                    {
                        console.log(_ModelObject);
                        _ModelObject.position.set(0, 0, 0);
                        _ModelObject.scale.set(0.01, 0.01, 0.01);
                        _Anchor0.group.add(_ModelObject);
                    });
                break;
            }
        default:
            {
                console.error("Invalid _TargetModelName : " + _TargetModelName);
                break;
            }
    }

    // Lights :

    const _AmbientLight = new THREE.AmbientLight("white", 0.5);

    _Scene.add(_AmbientLight);

    const _DirectionalLight = new THREE.DirectionalLight("white", 5);

    _DirectionalLight.position.set(0, 1, 1);

    _Scene.add(_DirectionalLight);
    
    const _DirLightHelper = new THREE.DirectionalLightHelper(_DirectionalLight, 5);

    _Scene.add(_DirLightHelper);

    // Button : To DAYOU website.

    // Start rendering
    _Render = true;
}

function ChickenSelected() {
    console.log("Chicken");
    _TargetModelName = "Chicken";
    SetSelectionButtonsVisible(false);
    InitMindAR();
    InitScene();
}

function CherrySelected() {
    console.log("Cherry");
    _TargetModelName = "Cherry";
    SetSelectionButtonsVisible(false);
    InitMindAR();
    InitScene();
}

function CactusSelected() {
    console.log("Cactus");
    _TargetModelName = "Cactus";
    SetSelectionButtonsVisible(false);
    InitMindAR();
    InitScene();
}

function Render() {
    if (_Render) {
        _Renderer.render(_Scene, _Camera);
    }
}

//#endregion

