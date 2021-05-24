import { ModuleRegister, RouteRaw, VoyoRouterModuleImp } from "./types";
import VueRouter from "vue-router";
import { Subject, Subscription } from "rxjs";
export declare class RouterModuleHooks {
    moduleStartSubject: Subject<null>;
    moduleErrorSubject: Subject<any>;
    moduleSuccessSubject: Subject<ModuleRegister>;
    loadModuleStart(): void;
    loadModuleError(e: any): void;
    loadModuleSuccess(moduleRegister: ModuleRegister): void;
    onLoadModuleStart(run: () => void): Subscription;
    onLoadModuleError(run: (err: any) => void): Subscription;
    onLoadModuleSuccess(run: (module: ModuleRegister) => void): Subscription;
}
export interface RouterModuleParams {
    routes: RouteRaw[];
    name?: string;
}
export declare class VoyoRouterModule extends RouterModuleHooks implements VoyoRouterModuleImp {
    name?: string;
    routes: RouteRaw[];
    router: VueRouter;
    constructor({ routes, name }: RouterModuleParams);
}
