import { State, StateChanges } from "../core/stateHandler/State";
import { getStateByName } from "./index";

export class MainScreenState extends State {
    getStateInfo(): { stateName: string; requiredEvents: string[]; } {
        return {
            stateName: "MainScreenState",
            requiredEvents: ["mainScreen.closed"]
        }
    }

    getStateChanges(): StateChanges {
        return {
            statesToAdd: [getStateByName("GameScreenState")],
        };
    }
}