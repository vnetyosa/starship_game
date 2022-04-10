import { ModuleHandler } from "./core/moduleHandler/ModuleHandler";
import { StateHandler } from "./core/stateHandler/StateHandler";
import { modules } from "./modules";
import { AnimationManager } from "./pixi/AnimationManager";
import { UserInteraction } from "./services/Interaction";
import { Win } from "./services/Win";
import { getStateByName } from "./states";

function initGlobalServices() {
    window.AnimationManager = new AnimationManager();
    window.AnimationManager.loadResources();
    window.Services = {
        win: new Win(),
        userInteraction: new UserInteraction(),
    };
    window.Resources = {};

    new ModuleHandler().processModules(modules);
    new StateHandler(getStateByName("SplashScreenState")).processStates();
}

function setupCanvas() {
    const canvas = window.AnimationManager.app.view;
    document.getElementById("gameWrapper")?.appendChild(canvas);
    document.body.onresize = () => window.AnimationManager.onResize();
    document.body.onload = () => window.AnimationManager.onResize();
}


initGlobalServices();
setupCanvas();

