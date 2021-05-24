declare type Lazy<T> = () => Promise<T>;
declare type VoyoModuleRaw = VoyoRouterModuleImp | Lazy<{
    default: any;
}>;
export declare class VoyoRouterModuleImp {
    name?: string;
    routes: RouteRaw[];
}
export interface VoyoRouteModuleRaw {
    voyoFullPath?: string;
    module?: VoyoModuleRaw;
    name?: string;
    path: string;
    components?: any;
    component?: any;
    beforeEnter?: any;
    parent?: any;
    redirect?: any;
    children?: VoyoRouteModuleRaw[];
}
export declare type RouteRaw = VoyoRouteModuleRaw;
export interface ModuleRegister {
    name: string;
    module: VoyoModuleRaw;
    path: string;
    loadComplete?: boolean;
}
export {};
