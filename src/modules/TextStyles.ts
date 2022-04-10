import * as PIXI from "pixi.js";

export function getSplashTextStyle() {
    return new PIXI.TextStyle({
        fill: [
            "#d72d2d",
            "#e27979",
            "#ffd6d6",
            "#de1212",
            "#3f0303"
        ],
        fontSize: 100,
        fontWeight: "bold",
        letterSpacing: 7,
        lineHeight: 72,
        lineJoin: "round",
        miterLimit: 8,
        stroke: "#940000",
        strokeThickness: 8
    });
}

export function getCreditsTextStyles() {
    return new PIXI.TextStyle({
        align: "center",
        dropShadow: true,
        dropShadowAngle: 0,
        dropShadowBlur: 16,
        dropShadowColor: "red",
        dropShadowDistance: 1,
        fill: [
            "white",
            "#a59c94"
        ],
        fillGradientStops: [
            0.6
        ],
        fontSize: 40,
        letterSpacing: 5,
        lineHeight: 94,
        lineJoin: "round",
        miterLimit: 0
    });
}