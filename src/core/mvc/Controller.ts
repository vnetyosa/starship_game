import { Observable } from "../Observable";
import { Model } from "./Model";
import { View } from "./View";

export class Controller<M extends Model, V extends View<M>> extends Observable {
    model: M;
    view: V;

    constructor(model: M, view: V) {
        super();
        this.model = model;
        this.view = view;
    }
}