import { EventEmitter } from "../core/EventEmitter";

export class Win extends EventEmitter {
    private _winAmount: number = 0;
    
    constructor() {
        super();
    }

    set winAmount(amount: number) {
        this._winAmount = amount;
        this.emit("win.updated");
    }

    get winAmount() {
        return this._winAmount;
    }
}