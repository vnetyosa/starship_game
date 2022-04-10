import * as PIXI from "pixi.js";
import { GlobalEventEmitter } from "../core/GlobalEventEmitter";
import layersConfig from "./layers.json";
import resourcesConfig from "./resources.json";

const CANVAS_CONFIG = {
    width: 800,
    height: 600,
}

interface LayerConfig {
    [layerName: string]: PIXI.Container;
}

const IMAGE_FOLDER_PATH = "../assets/";

export class AnimationManager {
    app: PIXI.Application;
    context;
    loader: PIXI.Loader;
    evenEmitter: GlobalEventEmitter;
    rootDisplayObject: PIXI.Container;
    layers: LayerConfig = {};

    constructor() {
        this.app = new PIXI.Application(CANVAS_CONFIG);
        this.loader = PIXI.Loader.shared;
        this.evenEmitter = GlobalEventEmitter.getInstance();
        this.context = this.app.view.getContext("webgl2") ||
            this.app.view.getContext("webgl");

        this.rootDisplayObject = new PIXI.Container();
        this.app.stage.addChild(this.rootDisplayObject);

        this.setupDefaultLayers(layersConfig.layers);
    }

    loadResources() {
        let imageConfig = resourcesConfig.assets as {[image: string]: string};
        for (let image in imageConfig) {
            const path = IMAGE_FOLDER_PATH + imageConfig[image];
            this.loader.add(image, path);
        }
        this.loader.load((loader, resources) => {
            for (let resource of Object.values(resources)) {
                window.Resources[resource.name] = new PIXI.Sprite(resource.texture);
            }
        });
        this.loader.onComplete.add(() => this.evenEmitter.emit("animationManager.resourcesLoaded"));
    }

    setupDefaultLayers(layers: string[]) {
        for (let layerName of layers) {
            const layer = new PIXI.Container();
            layer.name = layerName;
            this.rootDisplayObject.addChild(layer);
            this.layers[layerName] = layer;
        }
    }

    getLayer(layerName: string) {
        return this.layers[layerName];
    }

    onResize() {
        const {innerWidth, innerHeight} = window;
        const {width: canvasWidth, height: canvasHeight } = CANVAS_CONFIG;
        const xScale = innerWidth / canvasWidth;
        const yScale = innerHeight / canvasHeight;
        const scale = Math.min(xScale, yScale, 1);
        if (this.context) {
            this.context.canvas.width = canvasWidth * scale;
            this.context.canvas.height = canvasHeight * scale;
            this.rootDisplayObject.scale.set(scale);
        }
    }
}
