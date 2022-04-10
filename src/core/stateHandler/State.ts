import { EventEmitter } from "../EventEmitter";
import { GlobalEventEmitter } from "../GlobalEventEmitter";

interface EventState {
    [event: string]: boolean;
}

export interface StateChanges {
    statesToAdd?: State[],
    // TODO: check if i need this currently
    insertBefore?: string
}

export abstract class State extends EventEmitter {
    isActive: boolean;
    stateName: string;
    requiredEvents: string[];
    eventState: EventState;
    _eventEmitter: GlobalEventEmitter;

    constructor() {
        super();
        this.eventState = {};
        const stateInfo = this.getStateInfo();
        this.stateName = stateInfo.stateName;
        this.requiredEvents = stateInfo.requiredEvents;
        this.isActive = false;
        this._eventEmitter = GlobalEventEmitter.getInstance();
        this.setupEvents();
    }

    setupEvents() {
        for (let event of this.requiredEvents) {
            this._eventEmitter.addListener(event, this.onEventRecieved.bind(this, event));
        }
    }

    abstract getStateInfo(): { stateName: string, requiredEvents: string[] };

    enter() {
        this.isActive = true;
        this.resetEventState();
    }

    resetEventState() {
        for (let event in this.requiredEvents) {
            const isRecieved = false;
            this.eventState[event] = isRecieved;
        }
    }

    onEventRecieved(event: string) {
        if (this.isActive && event in this.requiredEvents) {
            const isRecieved = true;
            this.eventState[event] = isRecieved;
            if (this.shouldLeaveState()) {
                this.leave();
            }
        }
    }

    abstract getStateChanges(): StateChanges;

    shouldLeaveState() {
        const eventStates = Object.values(this.eventState);
        // maybe it's obvious, but it improves readability imo
        return eventStates.every((isRecieved: boolean) => isRecieved === true);
    }

    leave() {
        this.emit("leave");
        this.isActive = false;
    }
}