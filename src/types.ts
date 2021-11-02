type Lazy<T> = () => Promise<T>;
type VoyoModuleRaw = VoyoRouterModuleImp | Lazy<{ default: any }>;

export class VoyoRouterModuleImp {
  name?: string;
  routes: RouteRaw[];
}

export type ShouldLoad=(to:any,from:any,next:any)=>void;

export interface VoyoRouteModuleRaw {
  voyoFullPath?: string;
  module?: VoyoModuleRaw;
  name?: string;
  path: string;
  components?: any;
  component?: any;
  shouldLoad?: ShouldLoad;
  parent?: any;
  redirect?: any;
  children?: VoyoRouteModuleRaw[];
}

export type RouteRaw = VoyoRouteModuleRaw;

export interface ModuleRegister {
  name: string;
  module: VoyoModuleRaw;
  path: string;
  loadComplete?: boolean;
  shouldLoad?: ShouldLoad;
}
