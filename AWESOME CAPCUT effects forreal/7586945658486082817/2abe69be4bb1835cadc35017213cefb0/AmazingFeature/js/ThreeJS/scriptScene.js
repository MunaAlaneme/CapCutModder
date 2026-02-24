const TWEEN = require("./tween");
const THREE = require("./three-amg-wrapper").THREE;
class ScriptScene {
    constructor(amgScene = null, container = null) {
        if (amgScene) {
            this.scene = new THREE.Scene;
            this.scene._amgScene = amgScene
        } else {
            this.scene = new THREE.Scene
        }
        this.camera = null;
        this.scene.background = new THREE.Color(3355443);
        this.geometry_width = 2.25;
        this.geometry_height = 2.25;
        this.geometry_radius = 5;
        this.geometry_sides = 16;
        this.initCoreObjects();
        if (container) {
            this.init(container)
        }
    }
    initCoreObjects() {
        window.innerWidth = 3840;
        window.innerHeight = 2160;
        window.devicePixelRatio = 2;
        this.camera = new THREE.PerspectiveCamera(53.1, window.innerWidth / window.innerHeight, .1, 1e4);
        this.camera.position.z = 300;
        this.scene.add(this.camera);
        this.sliders = {};
        this.Duration = 3e3;
        this.TWEEN = TWEEN
    }
    onEvent(type, value) {
    }
    seekToTime(time) {
        let runningTweens = [];
        for (let i = 0; i <= this.sceneObjects.tweens.length - 1; i++) {
            runningTweens.push(this.sceneObjects.tweens[i])
        }
        runningTweens.forEach(tween => {
            tween.update(time)
        });
    }
    setupScene() {
        this.initSceneObjects();
        this.scene.background = new THREE.Color(3355443);
        this.camera.position.set(0, 0, 300);
        this.camera.lookAt(0, 0, -100);
        this.createPrismTunnelGroup();
        this.setupAnimations();
        return this.sceneObjects
    }
    initSceneObjects() {
        this.sceneObjects = {
            prismGroup: null,
            tweens: []
        };
        this.Duration = 1e3
    }
    createPrismTunnelGroup() {
        const group = new THREE.Group;
        group.name = "PrismTunnelGroup";
        group.rotation.x = -Math.PI / 2;
        const rings = 150;
        const tunnelLength = 340;
        const material = new THREE.MeshBasicMaterial({
            map: this.texture1,
            side: THREE.DoubleSide
        });
        const geometry = new THREE.PlaneGeometry(this.geometry_width, this.geometry_height);
        for (let i = 0; i < rings; i++) {
            const yPos = 25 - i * (tunnelLength / (rings - 1));
            for (let j = 0; j < this.geometry_sides; j++) {
                const angle = j / this.geometry_sides * Math.PI * 2;
                const x = this.geometry_radius * Math.sin(angle);
                const z = this.geometry_radius * Math.cos(angle);
                const mesh = new THREE.Mesh(geometry, material);
                mesh.name = `PrismFace_R${i}_S${j}`;
                mesh.position.set(x, yPos, z);
                mesh.rotation.y = angle;
                group.add(mesh)
            }
        }
        this.scene.add(group);
        this.sceneObjects.prismGroup = group;
	this.scene.remove(this.sceneObjects.prismGroup)
    }
    setupAnimations() {
        const duration = 1000;
        const floatMoveStart = {
            z: 20
        };
        const floatMoveEnd = {
            z: -30
        };
        const tweenFloatMove = new TWEEN.Tween({z: 20}).to({z: 20}, 0).easing(TWEEN.Easing.Linear.InOut).onUpdate(obj => { obj.z=obj.z });
        const cameraStart = {
            z: 300,
            rot: 0
        };
        const cameraEnd = {
            z: 291,
            rot: 360
        };
        const tweenCamera = new TWEEN.Tween(cameraStart).to(cameraEnd, duration).easing(TWEEN.Easing.Linear.InOut).onUpdate(obj => {
            this.camera.position.z = obj.z;
            this.camera.lookAt(0, 0, -100);
            this.camera.rotation.z = obj.rot * (Math.PI / 180)
        });
        this.sceneObjects.tweens.push(tweenCamera);
        tweenCamera.start()
    }
}
exports.ScriptScene = ScriptScene;