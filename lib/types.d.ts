import { _RouteRecordBase, RouteComponent, RouteRecordRedirectOption } from "vue-router";
declare type RouteProps = any;
declare type Lazy<T> = () => Promise<T>;
declare type RouteComponentRaw = RouteComponent | Lazy<RouteComponent>;
declare type VoyoModuleRaw = VoyoRouterModuleImp | Lazy<{
    default: VoyoRouterModuleImp;
}>;
export declare class VoyoRouterModuleImp {
    name?: string;
    routes: RouteRaw[];
}
interface RouteRecordSingleView extends _RouteRecordBase {
    component: RouteComponentRaw;
    components?: never;
    props?: RouteProps;
    module?: never;
}
interface RouteRecordMultipleViews extends _RouteRecordBase {
    components: Record<string, RouteComponentRaw>;
    component?: never;
    props?: Record<string, RouteProps> | boolean;
    module?: never;
}
interface RouteRecordRedirect extends _RouteRecordBase {
    redirect: RouteRecordRedirectOption;
    component?: never;
    components?: never;
    module?: never;
}
export interface VoyoRouteModuleRaw extends _RouteRecordBase {
    component?: never;
    components?: never;
    redirect?: never;
    props?: any;
    voyoFullPath?: string;
    module: VoyoModuleRaw;
}
export declare type RouteRaw = VoyoRouteModuleRaw | RouteRecordSingleView | RouteRecordMultipleViews | RouteRecordRedirect;
export interface ModuleRegister {
    name: string;
    module: VoyoModuleRaw;
    path: string;
    loadComplete?: boolean;
}
export {};
