import { Model } from "../../core/mvc/Model";
import { View } from "../../core/mvc/View";
import * as PIXI from "pixi.js";
import { getSplashTextStyle, getCreditsTextStyles } from "../TextStyles";
import { Utils } from "../Utils";

const SPLASH_TIMEOUT = 3000;
export class SplashScreenView extends View<Model> {
    root: PIXI.Container = new PIXI.Container();
    gameName: PIXI.Text | undefined;
    movie: PIXI.Sprite | undefined;
    credits: PIXI.Text | undefined;
    onClose: (() => void) | undefined;
  
    initAnimation() {
        const layer = this.getLayer();
        layer.addChild(this.root);
        this.setupTexts();
        this.setupMovie();
        this.refresh();
    }

    setupMovie() {
        const movieTexture = PIXI.Texture.from("../../../assets/splash/splash.mp4");
        this.movie = new PIXI.Sprite(movieTexture);
        this.movie.width = 600;
        this.movie.height = 450;
        this.movie.anchor.set(0.5);
        this.movie.position.set(400, 175);
        this.root.addChild(this.movie);
    }

    setupTexts() {
        this.gameName = new PIXI.Text("Shoot`em", getSplashTextStyle());
        this.gameName.anchor.set(0.5);
        this.credits = new PIXI.Text("Made by V. Netosa", getCreditsTextStyles());
        this.credits.anchor.set(0.5);
        this.gameName?.position.set(400, 450);
        this.credits?.position.set(550, 550);
        this.root.addChild(this.gameName, this.credits);
    }
        
    getLayer() {
        return window.AnimationManager.getLayer("startSplash");
    }
    
    show() {
        this.root.alpha = 1;
        setTimeout(this.fadeOut.bind(this), SPLASH_TIMEOUT);
    }

    async fadeOut() {
        await Utils.fadeOut(this.root, 2000);
        this.close();
    }

    close() {
        if (this.onClose) {
            this.onClose();
        }
    }

    refresh() {
    }
}