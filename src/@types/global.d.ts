import { AnimationManager } from "../pixi/AnimationManager";
import { UserInteraction } from "../services/Interaction";
import { Win } from "../services/Win";

declare global {
    interface Window {
        AnimationManager: AnimationManager;
        Services: {
            win: Win;
            userInteraction: UserInteraction;
        },
        Resources: {
            [imageName: string]: PIXI.Sprite,
        }
    }
}