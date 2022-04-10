import { ModuleClasses } from "./@types/Module";
import { Controller } from "./Controller";
import { Model } from "./Model";
import { View } from "./View";

export class Module {
    model: Model;
    view: View<Model>;
    controller: Controller<Model, View<Model>>;

    constructor() {
        let {model: ModelClass, view: ViewClass, controller: ControllerClass} = this.getModuleClasses();
        this.model = new ModelClass();
        this.view = new ViewClass(this.model);
        this.controller = new ControllerClass(this.model, this.view);
    }

    getModuleClasses(): ModuleClasses {
        return {
            model: Model,
            view: View,
            controller: Controller
        }
    }
}