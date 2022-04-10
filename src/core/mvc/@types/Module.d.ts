import { Controller } from "../Controller";
import { Model } from "../Model";
import { View } from "../View";

interface ModelConstructor {
    new(): Model;
}

interface ViewConstructor {
    new(model: Model): View<Model>;
}

interface ControllerConstructor {
    new(model: Model, view: View<Model>): Controller<Model, View<Model>>;
}

export type ModuleClasses = {
    model: ModelConstructor;
    view: ViewConstructor;
    controller: ControllerConstructor;
}