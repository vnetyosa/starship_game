export type CallbackFunc = (...args: any) => void;

export interface EventConfig {
    [event: string]: CallbackFunc;
}

export class EventEmitter {
    DEBUG: boolean;

    eventHandlers: Map<string, CallbackFunc[]>;
    
    constructor() {
        this.DEBUG = true;
        this.eventHandlers = new Map();
    }

    public addListener(event: string, handler: CallbackFunc) {
        let callbacks = this.eventHandlers.get(event);
        if (callbacks === undefined) {
            callbacks = [];
            this.eventHandlers.set(event, callbacks);
        }
        callbacks.push(handler);
        
        if (this.DEBUG) {
            console.info("Added listener for event", event, callbacks);
        }
    }

    public removeListeners(event: string) {
        this.eventHandlers.set(event, []);
    }

    public emit(event: string, ...args: any) {
        let callbacks = this.eventHandlers.get(event);
        if (this.DEBUG) {
            console.info(`Firing event ${event} with parameters ${args} for listeners`, callbacks);
        }
        if (callbacks === undefined) {
            return;
        }

        for (let callback of callbacks) {
            console.log(`calling callback for event ${event}`);
            callback(...args);
        }
    }
}