import { assert } from "chai";
import { GlobalEventEmitter } from "../../src/core/GlobalEventEmitter";
import { StateHandler } from "../../src/core/stateHandler/StateHandler";
import { getStateByName } from "../../src/states/index";

describe("State handler test", function() {
    it("Should switch states", function() {
        const startState = getStateByName("SplashScreenState");
        const globalEmitter = GlobalEventEmitter.getInstance();
        const stateHandler = new StateHandler(startState);
        let isCallbackInvoked = false;
        globalEmitter.addListener("stateHandler.enteringSplashScreenState", () => isCallbackInvoked = true);
        stateHandler.processStates();
        assert(isCallbackInvoked);
    });
});