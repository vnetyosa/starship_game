import { Module } from "../mvc/Module";

interface ModulesConfig { 
    [moduleName: string]: Module;
}

export class ModuleHandler {
    constructor(config: ModulesConfig) {
        for (let moduleName in config) {
            this.proessModule(moduleName, config[moduleName]);
        }
    }

    proessModule(moduleName: string, module: Module) {
        
    }
}