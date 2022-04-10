import { State } from "../core/stateHandler/State";
import { GameScreenState } from "./GameScreenState";
import { MainScreenState } from "./MainScreenState";
import { SplashScreenState } from "./SplashScreenState";

export const states: State[] = [
    SplashScreenState,
    MainScreenState,
    GameScreenState,
].map(stateConstructor => new stateConstructor());

export function getStateByName(stateName: string): State {
    const state = states.find((state: State) => state.stateName === stateName);
    if (state === undefined) {
        throw Error(`Error while trying to find state ${stateName}`);
    }
    return state;
}
