import { EventConfig, EventEmitter } from "./EventEmitter";

export class Observable {
    private _emitter: EventEmitter;
    
    constructor() {
        this._emitter = new EventEmitter();
    }

    public on(config: EventConfig) {
        for (let event in config) {
            this._emitter.addListener(event, config[event].bind(this));
        }
    }
}