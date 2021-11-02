import { VoyoRouterModule, RouterModuleParams } from "./voyo-router-module";
import VueRouter from "vue-router";
import { ModuleRegister, RouteRaw, VoyoRouteModuleRaw } from "./types";
export declare class VoyoRouterMain extends VoyoRouterModule {
    moduleRegisters: ModuleRegister[];
    constructor(params: RouterModuleParams);
    registryModule(route: VoyoRouteModuleRaw): void;
    mount(router: VueRouter): void;
    configModuleLoad(): void;
    loadModule(moduleRegister: ModuleRegister): Promise<void>;
    handleRoute(route: RouteRaw, parentPath?: string): void;
    appendRoutes(routes: RouteRaw[], parentPath?: string): void;
    appendChild(routes: RouteRaw[]): void;
}
