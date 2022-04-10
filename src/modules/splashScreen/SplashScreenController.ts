import { Controller } from "../../core/mvc/Controller";
import { Model } from "../../core/mvc/Model";
import { SplashScreenView } from "./SplashScreenView";

export class SplashScreenController extends Controller<Model, SplashScreenView> {
    setupEvents() {
        this.on({
            "animationManager.resourcesLoaded": this.onResourcesLoaded,
        })
    }

    onResourcesLoaded() {
        this.view.onClose = this.onClose.bind(this);
        this.view.initAnimation();
        this.view.show();
    }
    
    onClose() {
        this.emit("splashScreen.closed");
    }
}