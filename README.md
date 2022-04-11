# Shoot'em game.

Game is made using PIXI.js, TS, bundled using webpack. Chai tests.
Structure of this game is represented on diagram below. 


![starhsip_diagram](https://user-images.githubusercontent.com/51694488/162687442-23c0fab4-9a22-4fe0-8795-c4f55dd38c37.png)


I decided to use moduled with MVC structure for scalability reason
Despite fact, that currenlty game has 3 main modules and 3 respective states and it's more easy just to hardcode them without
any additional infrascture, this approach allows us to create arbitary amount of this states and modules in feature.

Each module should have event emitter inside that are separated from other modules visibility (in progess)
Also, game has global event emitter that are required for collaboration of this independet modules.
And services that contains information about current state of this game (amount of win, status, etc).
They was made as separate global instance because they should contain information that should be given to different modules, so it's more like
modules shared state.

Also, game contains statehandler (but it's more correct to say that it handles global stages of this game). Currently they are nearly the same
as modules. I thought that maybe it's worth to union modules with corresponding state, but if we think for scalability, this two instances more likely
should be independnet. Because from my point of view, some stages in game can include multiple modules. 

