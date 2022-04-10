/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/core/EventEmitter.ts":
/*!**********************************!*\
  !*** ./src/core/EventEmitter.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "EventEmitter": () => (/* binding */ EventEmitter)
/* harmony export */ });
class EventEmitter {
    constructor() {
        this.DEBUG = true;
        this.eventHandlers = new Map();
    }
    addListener(event, handler) {
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
    removeListeners(event) {
        this.eventHandlers.set(event, []);
    }
    emit(event, ...args) {
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


/***/ }),

/***/ "./src/core/GlobalEventEmitter.ts":
/*!****************************************!*\
  !*** ./src/core/GlobalEventEmitter.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GlobalEventEmitter": () => (/* binding */ GlobalEventEmitter)
/* harmony export */ });
/* harmony import */ var _EventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventEmitter */ "./src/core/EventEmitter.ts");

// Singleton event emitter
class GlobalEventEmitter extends _EventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    constructor() {
        super();
    }
    static getInstance() {
        if (!this._classInstance) {
            this._classInstance = new GlobalEventEmitter();
        }
        return this._classInstance;
    }
}


/***/ }),

/***/ "./src/core/stateHandler/State.ts":
/*!****************************************!*\
  !*** ./src/core/stateHandler/State.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "State": () => (/* binding */ State)
/* harmony export */ });
/* harmony import */ var _EventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../EventEmitter */ "./src/core/EventEmitter.ts");
/* harmony import */ var _GlobalEventEmitter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../GlobalEventEmitter */ "./src/core/GlobalEventEmitter.ts");


class State extends _EventEmitter__WEBPACK_IMPORTED_MODULE_0__.EventEmitter {
    constructor() {
        super();
        this.eventState = {};
        const stateInfo = this.getStateInfo();
        this.stateName = stateInfo.stateName;
        this.requiredEvents = stateInfo.requiredEvents;
        this.isActive = false;
        this._eventEmitter = _GlobalEventEmitter__WEBPACK_IMPORTED_MODULE_1__.GlobalEventEmitter.getInstance();
        this.setupEvents();
    }
    setupEvents() {
        for (let event of this.requiredEvents) {
            this._eventEmitter.addListener(event, this.onEventRecieved.bind(this, event));
        }
    }
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
    onEventRecieved(event) {
        if (this.isActive && event in this.requiredEvents) {
            const isRecieved = true;
            this.eventState[event] = isRecieved;
            if (this.shouldLeaveState()) {
                this.leave();
            }
        }
    }
    shouldLeaveState() {
        const eventStates = Object.values(this.eventState);
        // maybe it's obvious, but it improves readability imo
        return eventStates.every((isRecieved) => isRecieved === true);
    }
    leave() {
        this.emit("leave");
        this.isActive = false;
    }
}


/***/ }),

/***/ "./src/core/stateHandler/StateHandler.ts":
/*!***********************************************!*\
  !*** ./src/core/stateHandler/StateHandler.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StateHandler": () => (/* binding */ StateHandler)
/* harmony export */ });
/* harmony import */ var _GlobalEventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../GlobalEventEmitter */ "./src/core/GlobalEventEmitter.ts");

class StateHandler {
    constructor(startState) {
        this._emitter = _GlobalEventEmitter__WEBPACK_IMPORTED_MODULE_0__.GlobalEventEmitter.getInstance();
        this._stateStack = [startState];
    }
    async processStates() {
        while (this._stateStack.length > 0) {
            const state = this._stateStack.shift();
            this.emitEnteringEvents(state);
            this.processStateChanges(state);
            await this.waitForStateLeaving(state);
            this.emitLeavingEvents(state);
        }
    }
    getIndexToAddState(insertBefore) {
        let index = this._stateStack.length;
        if (insertBefore) {
            index = this._stateStack.findIndex(state => state.stateName === insertBefore);
        }
        return index;
    }
    processStateChanges(state) {
        let { statesToAdd, insertBefore } = state.getStateChanges();
        const indexToAdd = this.getIndexToAddState(insertBefore);
        this._stateStack.splice(indexToAdd, 0, ...(statesToAdd || []));
    }
    emitEnteringEvents(state) {
        this._emitter.emit(`stateHandler.entering${state.stateName}`);
    }
    emitLeavingEvents(state) {
        this._emitter.emit(`stateHandler.leaving${state.stateName}`);
    }
    waitForStateLeaving(state) {
        return new Promise((resolve) => {
            state.addListener("leave", resolve);
        });
    }
}


/***/ }),

/***/ "./src/states/GameScreenState.ts":
/*!***************************************!*\
  !*** ./src/states/GameScreenState.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GameScreenState": () => (/* binding */ GameScreenState)
/* harmony export */ });
/* harmony import */ var _core_stateHandler_State__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/stateHandler/State */ "./src/core/stateHandler/State.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index */ "./src/states/index.ts");


class GameScreenState extends _core_stateHandler_State__WEBPACK_IMPORTED_MODULE_0__.State {
    getStateInfo() {
        return {
            stateName: "GameScreenState",
            requiredEvents: ["gameScreen.closed"]
        };
    }
    getStateChanges() {
        return {
            statesToAdd: [(0,_index__WEBPACK_IMPORTED_MODULE_1__.getStateByName)("MainScreenState")],
        };
    }
}


/***/ }),

/***/ "./src/states/MainScreenState.ts":
/*!***************************************!*\
  !*** ./src/states/MainScreenState.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MainScreenState": () => (/* binding */ MainScreenState)
/* harmony export */ });
/* harmony import */ var _core_stateHandler_State__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/stateHandler/State */ "./src/core/stateHandler/State.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index */ "./src/states/index.ts");


class MainScreenState extends _core_stateHandler_State__WEBPACK_IMPORTED_MODULE_0__.State {
    getStateInfo() {
        return {
            stateName: "MainScreenState",
            requiredEvents: ["mainScreen.closed"]
        };
    }
    getStateChanges() {
        return {
            statesToAdd: [(0,_index__WEBPACK_IMPORTED_MODULE_1__.getStateByName)("GameScreenState")],
        };
    }
}


/***/ }),

/***/ "./src/states/SplashScreenState.ts":
/*!*****************************************!*\
  !*** ./src/states/SplashScreenState.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SplashScreenState": () => (/* binding */ SplashScreenState)
/* harmony export */ });
/* harmony import */ var _core_stateHandler_State__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/stateHandler/State */ "./src/core/stateHandler/State.ts");
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index */ "./src/states/index.ts");


class SplashScreenState extends _core_stateHandler_State__WEBPACK_IMPORTED_MODULE_0__.State {
    getStateInfo() {
        return {
            stateName: "SplashScreenState",
            requiredEvents: ["splashScreen.closed"]
        };
    }
    getStateChanges() {
        return {
            statesToAdd: [(0,_index__WEBPACK_IMPORTED_MODULE_1__.getStateByName)("MainScreenState")],
        };
    }
}


/***/ }),

/***/ "./src/states/index.ts":
/*!*****************************!*\
  !*** ./src/states/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getStateByName": () => (/* binding */ getStateByName),
/* harmony export */   "states": () => (/* binding */ states)
/* harmony export */ });
/* harmony import */ var _GameScreenState__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GameScreenState */ "./src/states/GameScreenState.ts");
/* harmony import */ var _MainScreenState__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./MainScreenState */ "./src/states/MainScreenState.ts");
/* harmony import */ var _SplashScreenState__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SplashScreenState */ "./src/states/SplashScreenState.ts");



const states = [
    _SplashScreenState__WEBPACK_IMPORTED_MODULE_2__.SplashScreenState,
    _MainScreenState__WEBPACK_IMPORTED_MODULE_1__.MainScreenState,
    _GameScreenState__WEBPACK_IMPORTED_MODULE_0__.GameScreenState,
].map(stateConstructor => new stateConstructor());
function getStateByName(stateName) {
    const state = states.find((state) => state.stateName === stateName);
    if (state === undefined) {
        throw Error(`Error while trying to find state ${stateName}`);
    }
    return state;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _core_GlobalEventEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/GlobalEventEmitter */ "./src/core/GlobalEventEmitter.ts");
/* harmony import */ var _core_stateHandler_StateHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/stateHandler/StateHandler */ "./src/core/stateHandler/StateHandler.ts");
/* harmony import */ var _states_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./states/index */ "./src/states/index.ts");



const startState = (0,_states_index__WEBPACK_IMPORTED_MODULE_2__.getStateByName)("SplashScreenState");
const globalEmitter = _core_GlobalEventEmitter__WEBPACK_IMPORTED_MODULE_0__.GlobalEventEmitter.getInstance();
const stateHandler = new _core_stateHandler_StateHandler__WEBPACK_IMPORTED_MODULE_1__.StateHandler(startState);
let isCallbackInvoked = false;
globalEmitter.addListener("stateHandler.enteringSplashScreenState", () => isCallbackInvoked = true);
stateHandler.processStates();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0FBQztBQUN2RCxNQUFNLGFBQWEsR0FBRyxvRkFBOEIsRUFBRSxDQUFDO0FBQ3ZELE1BQU0sWUFBWSxHQUFHLElBQUkseUVBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNsRCxJQUFJLGlCQUFpQixHQUFHLEtBQUssQ0FBQztBQUM5QixhQUFhLENBQUMsV0FBVyxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxDQUFDO0FBQ3BHLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3Nob290ZW0vLi9zcmMvY29yZS9FdmVudEVtaXR0ZXIudHMiLCJ3ZWJwYWNrOi8vc2hvb3RlbS8uL3NyYy9jb3JlL0dsb2JhbEV2ZW50RW1pdHRlci50cyIsIndlYnBhY2s6Ly9zaG9vdGVtLy4vc3JjL2NvcmUvc3RhdGVIYW5kbGVyL1N0YXRlLnRzIiwid2VicGFjazovL3Nob290ZW0vLi9zcmMvY29yZS9zdGF0ZUhhbmRsZXIvU3RhdGVIYW5kbGVyLnRzIiwid2VicGFjazovL3Nob290ZW0vLi9zcmMvc3RhdGVzL0dhbWVTY3JlZW5TdGF0ZS50cyIsIndlYnBhY2s6Ly9zaG9vdGVtLy4vc3JjL3N0YXRlcy9NYWluU2NyZWVuU3RhdGUudHMiLCJ3ZWJwYWNrOi8vc2hvb3RlbS8uL3NyYy9zdGF0ZXMvU3BsYXNoU2NyZWVuU3RhdGUudHMiLCJ3ZWJwYWNrOi8vc2hvb3RlbS8uL3NyYy9zdGF0ZXMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vc2hvb3RlbS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zaG9vdGVtL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9zaG9vdGVtL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2hvb3RlbS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Nob290ZW0vLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHR5cGUgQ2FsbGJhY2tGdW5jID0gKC4uLmFyZ3M6IGFueSkgPT4gdm9pZDtcblxuZXhwb3J0IGludGVyZmFjZSBFdmVudENvbmZpZyB7XG4gICAgW2V2ZW50OiBzdHJpbmddOiBDYWxsYmFja0Z1bmM7XG59XG5cbmV4cG9ydCBjbGFzcyBFdmVudEVtaXR0ZXIge1xuICAgIERFQlVHOiBib29sZWFuO1xuXG4gICAgZXZlbnRIYW5kbGVyczogTWFwPHN0cmluZywgQ2FsbGJhY2tGdW5jW10+O1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkRFQlVHID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzID0gbmV3IE1hcCgpO1xuICAgIH1cblxuICAgIHB1YmxpYyBhZGRMaXN0ZW5lcihldmVudDogc3RyaW5nLCBoYW5kbGVyOiBDYWxsYmFja0Z1bmMpIHtcbiAgICAgICAgbGV0IGNhbGxiYWNrcyA9IHRoaXMuZXZlbnRIYW5kbGVycy5nZXQoZXZlbnQpO1xuICAgICAgICBpZiAoY2FsbGJhY2tzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNhbGxiYWNrcyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzLnNldChldmVudCwgY2FsbGJhY2tzKTtcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFja3MucHVzaChoYW5kbGVyKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLkRFQlVHKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oXCJBZGRlZCBsaXN0ZW5lciBmb3IgZXZlbnRcIiwgZXZlbnQsIGNhbGxiYWNrcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgcmVtb3ZlTGlzdGVuZXJzKGV2ZW50OiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXJzLnNldChldmVudCwgW10pO1xuICAgIH1cblxuICAgIHB1YmxpYyBlbWl0KGV2ZW50OiBzdHJpbmcsIC4uLmFyZ3M6IGFueSkge1xuICAgICAgICBsZXQgY2FsbGJhY2tzID0gdGhpcy5ldmVudEhhbmRsZXJzLmdldChldmVudCk7XG4gICAgICAgIGlmICh0aGlzLkRFQlVHKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oYEZpcmluZyBldmVudCAke2V2ZW50fSB3aXRoIHBhcmFtZXRlcnMgJHthcmdzfSBmb3IgbGlzdGVuZXJzYCwgY2FsbGJhY2tzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FsbGJhY2tzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIGNhbGxiYWNrcykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coYGNhbGxpbmcgY2FsbGJhY2sgZm9yIGV2ZW50ICR7ZXZlbnR9YCk7XG4gICAgICAgICAgICBjYWxsYmFjayguLi5hcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tIFwiLi9FdmVudEVtaXR0ZXJcIjtcblxuLy8gU2luZ2xldG9uIGV2ZW50IGVtaXR0ZXJcbmV4cG9ydCBjbGFzcyBHbG9iYWxFdmVudEVtaXR0ZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIHByaXZhdGUgc3RhdGljIF9jbGFzc0luc3RhbmNlOiBHbG9iYWxFdmVudEVtaXR0ZXIgfCB1bmRlZmluZWQ7XG5cbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRJbnN0YW5jZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9jbGFzc0luc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLl9jbGFzc0luc3RhbmNlID0gbmV3IEdsb2JhbEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9jbGFzc0luc3RhbmNlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tIFwiLi4vRXZlbnRFbWl0dGVyXCI7XG5pbXBvcnQgeyBHbG9iYWxFdmVudEVtaXR0ZXIgfSBmcm9tIFwiLi4vR2xvYmFsRXZlbnRFbWl0dGVyXCI7XG5cbmludGVyZmFjZSBFdmVudFN0YXRlIHtcbiAgICBbZXZlbnQ6IHN0cmluZ106IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhdGVDaGFuZ2VzIHtcbiAgICBzdGF0ZXNUb0FkZD86IFN0YXRlW10sXG4gICAgLy8gVE9ETzogY2hlY2sgaWYgaSBuZWVkIHRoaXMgY3VycmVudGx5XG4gICAgaW5zZXJ0QmVmb3JlPzogc3RyaW5nXG59XG5cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTdGF0ZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgaXNBY3RpdmU6IGJvb2xlYW47XG4gICAgc3RhdGVOYW1lOiBzdHJpbmc7XG4gICAgcmVxdWlyZWRFdmVudHM6IHN0cmluZ1tdO1xuICAgIGV2ZW50U3RhdGU6IEV2ZW50U3RhdGU7XG4gICAgX2V2ZW50RW1pdHRlcjogR2xvYmFsRXZlbnRFbWl0dGVyO1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZXZlbnRTdGF0ZSA9IHt9O1xuICAgICAgICBjb25zdCBzdGF0ZUluZm8gPSB0aGlzLmdldFN0YXRlSW5mbygpO1xuICAgICAgICB0aGlzLnN0YXRlTmFtZSA9IHN0YXRlSW5mby5zdGF0ZU5hbWU7XG4gICAgICAgIHRoaXMucmVxdWlyZWRFdmVudHMgPSBzdGF0ZUluZm8ucmVxdWlyZWRFdmVudHM7XG4gICAgICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fZXZlbnRFbWl0dGVyID0gR2xvYmFsRXZlbnRFbWl0dGVyLmdldEluc3RhbmNlKCk7XG4gICAgICAgIHRoaXMuc2V0dXBFdmVudHMoKTtcbiAgICB9XG5cbiAgICBzZXR1cEV2ZW50cygpIHtcbiAgICAgICAgZm9yIChsZXQgZXZlbnQgb2YgdGhpcy5yZXF1aXJlZEV2ZW50cykge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRFbWl0dGVyLmFkZExpc3RlbmVyKGV2ZW50LCB0aGlzLm9uRXZlbnRSZWNpZXZlZC5iaW5kKHRoaXMsIGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhYnN0cmFjdCBnZXRTdGF0ZUluZm8oKTogeyBzdGF0ZU5hbWU6IHN0cmluZywgcmVxdWlyZWRFdmVudHM6IHN0cmluZ1tdIH07XG5cbiAgICBlbnRlcigpIHtcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMucmVzZXRFdmVudFN0YXRlKCk7XG4gICAgfVxuXG4gICAgcmVzZXRFdmVudFN0YXRlKCkge1xuICAgICAgICBmb3IgKGxldCBldmVudCBpbiB0aGlzLnJlcXVpcmVkRXZlbnRzKSB7XG4gICAgICAgICAgICBjb25zdCBpc1JlY2lldmVkID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmV2ZW50U3RhdGVbZXZlbnRdID0gaXNSZWNpZXZlZDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRXZlbnRSZWNpZXZlZChldmVudDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQWN0aXZlICYmIGV2ZW50IGluIHRoaXMucmVxdWlyZWRFdmVudHMpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzUmVjaWV2ZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5ldmVudFN0YXRlW2V2ZW50XSA9IGlzUmVjaWV2ZWQ7XG4gICAgICAgICAgICBpZiAodGhpcy5zaG91bGRMZWF2ZVN0YXRlKCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxlYXZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhYnN0cmFjdCBnZXRTdGF0ZUNoYW5nZXMoKTogU3RhdGVDaGFuZ2VzO1xuXG4gICAgc2hvdWxkTGVhdmVTdGF0ZSgpIHtcbiAgICAgICAgY29uc3QgZXZlbnRTdGF0ZXMgPSBPYmplY3QudmFsdWVzKHRoaXMuZXZlbnRTdGF0ZSk7XG4gICAgICAgIC8vIG1heWJlIGl0J3Mgb2J2aW91cywgYnV0IGl0IGltcHJvdmVzIHJlYWRhYmlsaXR5IGltb1xuICAgICAgICByZXR1cm4gZXZlbnRTdGF0ZXMuZXZlcnkoKGlzUmVjaWV2ZWQ6IGJvb2xlYW4pID0+IGlzUmVjaWV2ZWQgPT09IHRydWUpO1xuICAgIH1cblxuICAgIGxlYXZlKCkge1xuICAgICAgICB0aGlzLmVtaXQoXCJsZWF2ZVwiKTtcbiAgICAgICAgdGhpcy5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBHbG9iYWxFdmVudEVtaXR0ZXIgfSBmcm9tIFwiLi4vR2xvYmFsRXZlbnRFbWl0dGVyXCI7XG5pbXBvcnQgeyBTdGF0ZSB9IGZyb20gXCIuL1N0YXRlXCI7XG5cbmV4cG9ydCBjbGFzcyBTdGF0ZUhhbmRsZXIge1xuICAgIHByaXZhdGUgX2VtaXR0ZXI6IEdsb2JhbEV2ZW50RW1pdHRlcjtcbiAgICBwcml2YXRlIF9zdGF0ZVN0YWNrOiBTdGF0ZVtdO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHN0YXJ0U3RhdGU6IFN0YXRlKSB7XG4gICAgICAgIHRoaXMuX2VtaXR0ZXIgPSBHbG9iYWxFdmVudEVtaXR0ZXIuZ2V0SW5zdGFuY2UoKTtcbiAgICAgICAgdGhpcy5fc3RhdGVTdGFjayA9IFtzdGFydFN0YXRlXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgYXN5bmMgcHJvY2Vzc1N0YXRlcygpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMuX3N0YXRlU3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLl9zdGF0ZVN0YWNrLnNoaWZ0KCkgYXMgU3RhdGU7XG4gICAgICAgICAgICB0aGlzLmVtaXRFbnRlcmluZ0V2ZW50cyhzdGF0ZSk7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NTdGF0ZUNoYW5nZXMoc3RhdGUpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy53YWl0Rm9yU3RhdGVMZWF2aW5nKHN0YXRlKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdExlYXZpbmdFdmVudHMoc3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRJbmRleFRvQWRkU3RhdGUoaW5zZXJ0QmVmb3JlOiBzdHJpbmcgfCB1bmRlZmluZWQpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fc3RhdGVTdGFjay5sZW5ndGg7XG4gICAgICAgIGlmIChpbnNlcnRCZWZvcmUpIHtcbiAgICAgICAgICAgIGluZGV4ID0gdGhpcy5fc3RhdGVTdGFjay5maW5kSW5kZXgoc3RhdGUgPT4gc3RhdGUuc3RhdGVOYW1lID09PSBpbnNlcnRCZWZvcmUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHByb2Nlc3NTdGF0ZUNoYW5nZXMoc3RhdGU6IFN0YXRlKSB7XG4gICAgICAgIGxldCB7IHN0YXRlc1RvQWRkLCBpbnNlcnRCZWZvcmUgfSA9IHN0YXRlLmdldFN0YXRlQ2hhbmdlcygpO1xuICAgICAgICBjb25zdCBpbmRleFRvQWRkID0gdGhpcy5nZXRJbmRleFRvQWRkU3RhdGUoaW5zZXJ0QmVmb3JlKTtcbiAgICAgICAgdGhpcy5fc3RhdGVTdGFjay5zcGxpY2UoaW5kZXhUb0FkZCwgMCwgLi4uKHN0YXRlc1RvQWRkIHx8IFtdKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbWl0RW50ZXJpbmdFdmVudHMoc3RhdGU6IFN0YXRlKSB7XG4gICAgICAgIHRoaXMuX2VtaXR0ZXIuZW1pdChgc3RhdGVIYW5kbGVyLmVudGVyaW5nJHtzdGF0ZS5zdGF0ZU5hbWV9YCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBlbWl0TGVhdmluZ0V2ZW50cyhzdGF0ZTogU3RhdGUpIHtcbiAgICAgICAgdGhpcy5fZW1pdHRlci5lbWl0KGBzdGF0ZUhhbmRsZXIubGVhdmluZyR7c3RhdGUuc3RhdGVOYW1lfWApO1xuICAgIH1cblxuICAgIHByaXZhdGUgd2FpdEZvclN0YXRlTGVhdmluZyhzdGF0ZTogU3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBzdGF0ZS5hZGRMaXN0ZW5lcihcImxlYXZlXCIsIHJlc29sdmUpO1xuICAgICAgICB9KTtcbiAgICB9XG59IiwiaW1wb3J0IHsgU3RhdGUsIFN0YXRlQ2hhbmdlcyB9IGZyb20gXCIuLi9jb3JlL3N0YXRlSGFuZGxlci9TdGF0ZVwiO1xuaW1wb3J0IHsgZ2V0U3RhdGVCeU5hbWUgfSBmcm9tIFwiLi9pbmRleFwiO1xuXG5leHBvcnQgY2xhc3MgR2FtZVNjcmVlblN0YXRlICBleHRlbmRzIFN0YXRlIHtcbiAgICBnZXRTdGF0ZUluZm8oKTogeyBzdGF0ZU5hbWU6IHN0cmluZzsgcmVxdWlyZWRFdmVudHM6IHN0cmluZ1tdOyB9IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXRlTmFtZTogXCJHYW1lU2NyZWVuU3RhdGVcIixcbiAgICAgICAgICAgIHJlcXVpcmVkRXZlbnRzOiBbXCJnYW1lU2NyZWVuLmNsb3NlZFwiXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U3RhdGVDaGFuZ2VzKCk6IFN0YXRlQ2hhbmdlcyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0ZXNUb0FkZDogW2dldFN0YXRlQnlOYW1lKFwiTWFpblNjcmVlblN0YXRlXCIpXSxcbiAgICAgICAgfVxuICAgIH0gICBcbn0iLCJpbXBvcnQgeyBTdGF0ZSwgU3RhdGVDaGFuZ2VzIH0gZnJvbSBcIi4uL2NvcmUvc3RhdGVIYW5kbGVyL1N0YXRlXCI7XG5pbXBvcnQgeyBnZXRTdGF0ZUJ5TmFtZSB9IGZyb20gXCIuL2luZGV4XCI7XG5cbmV4cG9ydCBjbGFzcyBNYWluU2NyZWVuU3RhdGUgZXh0ZW5kcyBTdGF0ZSB7XG4gICAgZ2V0U3RhdGVJbmZvKCk6IHsgc3RhdGVOYW1lOiBzdHJpbmc7IHJlcXVpcmVkRXZlbnRzOiBzdHJpbmdbXTsgfSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0ZU5hbWU6IFwiTWFpblNjcmVlblN0YXRlXCIsXG4gICAgICAgICAgICByZXF1aXJlZEV2ZW50czogW1wibWFpblNjcmVlbi5jbG9zZWRcIl1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFN0YXRlQ2hhbmdlcygpOiBTdGF0ZUNoYW5nZXMge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdGVzVG9BZGQ6IFtnZXRTdGF0ZUJ5TmFtZShcIkdhbWVTY3JlZW5TdGF0ZVwiKV0sXG4gICAgICAgIH07XG4gICAgfVxufSIsImltcG9ydCB7IFN0YXRlLCBTdGF0ZUNoYW5nZXMgfSBmcm9tIFwiLi4vY29yZS9zdGF0ZUhhbmRsZXIvU3RhdGVcIjtcbmltcG9ydCB7IGdldFN0YXRlQnlOYW1lIH0gZnJvbSBcIi4vaW5kZXhcIjtcblxuZXhwb3J0IGNsYXNzIFNwbGFzaFNjcmVlblN0YXRlIGV4dGVuZHMgU3RhdGUge1xuICAgIGdldFN0YXRlSW5mbygpOiB7IHN0YXRlTmFtZTogc3RyaW5nOyByZXF1aXJlZEV2ZW50czogc3RyaW5nW107IH0ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdGVOYW1lOiBcIlNwbGFzaFNjcmVlblN0YXRlXCIsXG4gICAgICAgICAgICByZXF1aXJlZEV2ZW50czogW1wic3BsYXNoU2NyZWVuLmNsb3NlZFwiXVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0U3RhdGVDaGFuZ2VzKCk6IFN0YXRlQ2hhbmdlcyB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0ZXNUb0FkZDogW2dldFN0YXRlQnlOYW1lKFwiTWFpblNjcmVlblN0YXRlXCIpXSxcbiAgICAgICAgfTtcbiAgICB9XG59IiwiaW1wb3J0IHsgU3RhdGUgfSBmcm9tIFwiLi4vY29yZS9zdGF0ZUhhbmRsZXIvU3RhdGVcIjtcbmltcG9ydCB7IEdhbWVTY3JlZW5TdGF0ZSB9IGZyb20gXCIuL0dhbWVTY3JlZW5TdGF0ZVwiO1xuaW1wb3J0IHsgTWFpblNjcmVlblN0YXRlIH0gZnJvbSBcIi4vTWFpblNjcmVlblN0YXRlXCI7XG5pbXBvcnQgeyBTcGxhc2hTY3JlZW5TdGF0ZSB9IGZyb20gXCIuL1NwbGFzaFNjcmVlblN0YXRlXCI7XG5cbmV4cG9ydCBjb25zdCBzdGF0ZXM6IFN0YXRlW10gPSBbXG4gICAgU3BsYXNoU2NyZWVuU3RhdGUsXG4gICAgTWFpblNjcmVlblN0YXRlLFxuICAgIEdhbWVTY3JlZW5TdGF0ZSxcbl0ubWFwKHN0YXRlQ29uc3RydWN0b3IgPT4gbmV3IHN0YXRlQ29uc3RydWN0b3IoKSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRTdGF0ZUJ5TmFtZShzdGF0ZU5hbWU6IHN0cmluZyk6IFN0YXRlIHtcbiAgICBjb25zdCBzdGF0ZSA9IHN0YXRlcy5maW5kKChzdGF0ZTogU3RhdGUpID0+IHN0YXRlLnN0YXRlTmFtZSA9PT0gc3RhdGVOYW1lKTtcbiAgICBpZiAoc3RhdGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBFcnJvcihgRXJyb3Igd2hpbGUgdHJ5aW5nIHRvIGZpbmQgc3RhdGUgJHtzdGF0ZU5hbWV9YCk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0ZTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgR2xvYmFsRXZlbnRFbWl0dGVyIH0gZnJvbSBcIi4vY29yZS9HbG9iYWxFdmVudEVtaXR0ZXJcIjtcbmltcG9ydCB7IFN0YXRlSGFuZGxlciB9IGZyb20gXCIuL2NvcmUvc3RhdGVIYW5kbGVyL1N0YXRlSGFuZGxlclwiO1xuaW1wb3J0IHsgZ2V0U3RhdGVCeU5hbWUgfSBmcm9tIFwiLi9zdGF0ZXMvaW5kZXhcIjtcblxuY29uc3Qgc3RhcnRTdGF0ZSA9IGdldFN0YXRlQnlOYW1lKFwiU3BsYXNoU2NyZWVuU3RhdGVcIik7XG5jb25zdCBnbG9iYWxFbWl0dGVyID0gR2xvYmFsRXZlbnRFbWl0dGVyLmdldEluc3RhbmNlKCk7XG5jb25zdCBzdGF0ZUhhbmRsZXIgPSBuZXcgU3RhdGVIYW5kbGVyKHN0YXJ0U3RhdGUpO1xubGV0IGlzQ2FsbGJhY2tJbnZva2VkID0gZmFsc2U7XG5nbG9iYWxFbWl0dGVyLmFkZExpc3RlbmVyKFwic3RhdGVIYW5kbGVyLmVudGVyaW5nU3BsYXNoU2NyZWVuU3RhdGVcIiwgKCkgPT4gaXNDYWxsYmFja0ludm9rZWQgPSB0cnVlKTtcbnN0YXRlSGFuZGxlci5wcm9jZXNzU3RhdGVzKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=