import { Model } from "./Model";

export class View<M extends Model>{
    model: M;
   
    constructor(model: M) {
        this.model = model;
    }
}