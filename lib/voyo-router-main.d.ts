import { VoyoRouterModule, RouterModuleParams } from "./voyo-router-module";
import { Router } from "vue-router";
import { ModuleRegister, RouteRaw, VoyoRouteModuleRaw, VoyoRouterModuleImp } from "./types";
export declare class VoyoRouterMain extends VoyoRouterModule {
    moduleRegisters: ModuleRegister[];
    constructor(params: RouterModuleParams);
    registryModule(route: VoyoRouteModuleRaw, parentPath?: string): void;
    mount(router: Router): void;
    handleModuleLoad(): void;
    loadModule(moduleRegister: ModuleRegister): Promise<void>;
    handleRoute(route: RouteRaw, parentPath?: string): void;
    handleRoutes(routes: RouteRaw[], parentPath?: string): void;
    appendChild(moduleName: string, module: VoyoRouterModuleImp): void;
}
