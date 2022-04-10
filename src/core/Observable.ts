import { EventConfig, EventEmitter } from "./EventEmitter";
import { GlobalEventEmitter } from "./GlobalEventEmitter";

export class Observable {
    private _emitter: GlobalEventEmitter;
    
    constructor() {
        this._emitter = GlobalEventEmitter.getInstance();
    }

    public on(config: EventConfig) {
        for (let event in config) {
            this._emitter.addListener(event, config[event].bind(this));
        }
    }

    public emit(event: string) {
        this._emitter.emit(event);
    }
}