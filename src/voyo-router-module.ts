import {
  ModuleRegister,
  RouteRaw,
  VoyoRouteModuleRaw,
  VoyoRouterModuleImp,
} from "./types";
import { Router, RouteRecordRaw } from "vue-router";
import { Subject, Subscription } from "rxjs";

export class RouterModuleHooks {
  moduleStartSubject = new Subject<null>();
  moduleErrorSubject = new Subject<any>();
  moduleSuccessSubject = new Subject<ModuleRegister>();
  loadModuleStart() {
    this.moduleStartSubject.next(null);
  }
  loadModuleError(e: any) {
    this.moduleErrorSubject.next(e);
  }
  loadModuleSuccess(moduleRegister: ModuleRegister) {
    this.moduleSuccessSubject.next(moduleRegister);
  }

  onLoadModuleStart(run: () => void): Subscription {
    return this.moduleStartSubject.subscribe(run);
  }
  onLoadModuleError(run: (err: any) => void): Subscription {
    return this.moduleErrorSubject.subscribe(run);
  }
  onLoadModuleSuccess(run: (module: ModuleRegister) => void): Subscription {
    return this.moduleSuccessSubject.subscribe(run);
  }
}
export interface RouterModuleParams {
  routes: RouteRaw[];
  name?: string;
}

export class VoyoRouterModule
  extends RouterModuleHooks
  implements VoyoRouterModuleImp
{
  name?: string;
  routes: RouteRaw[];
  router: Router;

  constructor({ routes, name }: RouterModuleParams) {
    super();
    this.routes = routes;
    this.name = name;
  }
}
