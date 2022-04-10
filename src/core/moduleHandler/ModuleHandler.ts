import { ModuleConstructor } from "../mvc/@types/Module";
import { Module } from "../mvc/Module";

interface ModulesConfig { 
    [moduleName: string]: ModuleConstructor;
}
let modules:any = {};

export class ModuleHandler {
    processModules(config: ModulesConfig) {
        for (let moduleName in config) {
            const constructor = config[moduleName];
            modules[moduleName] = new constructor();
        }
    }
}
