import { EventEmitter } from "./EventEmitter";

// Singleton event emitter
export class GlobalEventEmitter extends EventEmitter {
    private static _classInstance: GlobalEventEmitter | undefined;

    private constructor() {
        super();
    }

    static getInstance() {
        if (!this._classInstance) {
            this._classInstance = new GlobalEventEmitter();
        }
        return this._classInstance;
    }
}