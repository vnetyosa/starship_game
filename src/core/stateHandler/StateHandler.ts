import { GlobalEventEmitter } from "../GlobalEventEmitter";
import { State } from "./State";

export class StateHandler {
    private _emitter: GlobalEventEmitter;
    private _stateStack: State[];
    
    constructor(startState: State) {
        this._emitter = GlobalEventEmitter.getInstance();
        this._stateStack = [startState];
    }

    public async processStates() {
        while (this._stateStack.length > 0) {
            const state = this._stateStack.shift() as State;
            state.enter();
            this.emitEnteringEvents(state);
            this.processStateChanges(state);
            await this.waitForStateLeaving(state);
            this.emitLeavingEvents(state);
        }
    }

    private getIndexToAddState(insertBefore: string | undefined) {
        let index = this._stateStack.length;
        if (insertBefore) {
            index = this._stateStack.findIndex(state => state.stateName === insertBefore);
        }
        return index;
    }

    private processStateChanges(state: State) {
        let { statesToAdd, insertBefore } = state.getStateChanges();
        const indexToAdd = this.getIndexToAddState(insertBefore);
        this._stateStack.splice(indexToAdd, 0, ...(statesToAdd || []));
    }

    private emitEnteringEvents(state: State) {
        this._emitter.emit(`stateHandler.entering${state.stateName}`);
    }

    private emitLeavingEvents(state: State) {
        this._emitter.emit(`stateHandler.leaving${state.stateName}`);
    }

    private waitForStateLeaving(state: State) {
        return new Promise((resolve) => {
            state.addListener("leave", resolve);
        });
    }
}