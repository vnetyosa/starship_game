import * as PIXI from "pixi.js";

export class Utils {
    static fadeOut(element: PIXI.DisplayObject, time: number) {
        let timer: number | null = null;
        let startingTimeStamp = 0;
        return new Promise((resolve) => {
            const fadeOutLoop = (currentTimeStamp: number) => {
                if (!startingTimeStamp) {
                    startingTimeStamp = currentTimeStamp;
                }
                timer && cancelAnimationFrame(timer);
                if (element.alpha === 0) {
                    resolve(null);
                    return;
                }
                element.alpha = Math.max(0, 1 - (currentTimeStamp - startingTimeStamp) / time);
                timer = requestAnimationFrame(fadeOutLoop);
            }
            timer = requestAnimationFrame(fadeOutLoop);
        })
    }
}