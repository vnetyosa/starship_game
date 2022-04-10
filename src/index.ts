import { GlobalEventEmitter } from "./core/GlobalEventEmitter";
import { StateHandler } from "./core/stateHandler/StateHandler";
import { getStateByName } from "./states/index";

const startState = getStateByName("SplashScreenState");
const globalEmitter = GlobalEventEmitter.getInstance();
const stateHandler = new StateHandler(startState);
let isCallbackInvoked = false;
globalEmitter.addListener("stateHandler.enteringSplashScreenState", () => isCallbackInvoked = true);
stateHandler.processStates();
