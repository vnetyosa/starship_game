import { Model } from "../../core/mvc/Model";
import { Module } from "../../core/mvc/Module";
import { SplashScreenController } from "./SplashScreenController";
import { SplashScreenView } from "./SplashScreenView";

export class SplashScreenModule extends Module {
    getModuleClasses(): any {
        return {
            model: Model,
            view: SplashScreenView,
            controller: SplashScreenController,
        }
    }
}