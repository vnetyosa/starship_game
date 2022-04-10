import { State, StateChanges } from "../core/stateHandler/State";
import { getStateByName } from "./index";

export class SplashScreenState extends State {
    getStateInfo(): { stateName: string; requiredEvents: string[]; } {
        return {
            stateName: "SplashScreenState",
            requiredEvents: ["splashScreen.closed"]
        }
    }

    getStateChanges(): StateChanges {
        return {
            statesToAdd: [getStateByName("MainScreenState")],
        };
    }
}