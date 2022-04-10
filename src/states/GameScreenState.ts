import { State, StateChanges } from "../core/stateHandler/State";
import { getStateByName } from "./index";

export class GameScreenState  extends State {
    getStateInfo(): { stateName: string; requiredEvents: string[]; } {
        return {
            stateName: "GameScreenState",
            requiredEvents: ["gameScreen.closed"]
        }
    }

    getStateChanges(): StateChanges {
        return {
            statesToAdd: [getStateByName("MainScreenState")],
        }
    }   
}