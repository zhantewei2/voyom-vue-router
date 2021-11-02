import { VoyoRouterModule, RouterModuleParams } from "./voyo-router-module";
import VueRouter from "vue-router";
import {
  ModuleRegister,
  RouteRaw,
  VoyoRouteModuleRaw,
  VoyoRouterModuleImp,
} from "./types";
import { setting, resolveUrl } from "./tool";
import { getUniqueId } from "@ztwx/utils";
import {guardShouldLoad} from "./guard";

export class VoyoRouterMain extends VoyoRouterModule {
  moduleRegisters: ModuleRegister[] = [];
  constructor(params: RouterModuleParams) {
    super(params);
  }

  registryModule(route: VoyoRouteModuleRaw) {
    this.moduleRegisters.push({
      name: route.name as string,
      module: route.module as any,
      path: route.voyoFullPath as string,
      loadComplete: false,
      shouldLoad: route.shouldLoad
    });
  }

  mount(router: VueRouter) {
    this.router = router;
    this.appendRoutes(this.routes);
    this.configModuleLoad();
  }

  configModuleLoad() {
    this.router.beforeEach((to: any, from: any, next: any) => {
      let moduleRegister: ModuleRegister;
      const targetPath = to.fullPath;
      let willLoadModule = false;
      for (moduleRegister of this.moduleRegisters) {
        if (
          !moduleRegister.loadComplete &&
          targetPath.startsWith(moduleRegister.path)
        ) {
          willLoadModule = true;
          guardShouldLoad(moduleRegister,to,from,next,()=>{
            this.loadModuleStart();
            this.loadModule(moduleRegister)
              .then(() => {
                moduleRegister.loadComplete = true;
                this.loadModuleSuccess(moduleRegister);
                next(to.fullPath);
              })
              .catch((e: any) => {
                console.warn("[Module load error]", e);
                this.loadModuleError(e);
              });
          });
          break;
        }
      }
      !willLoadModule && next(true);
    });
  }
  async loadModule(moduleRegister: ModuleRegister): Promise<void> {
    const module = moduleRegister.module;
    const voyoRouterModule: VoyoRouterModuleImp =
      module instanceof Function ? (await module()).default : module;
    this.appendRoutes(voyoRouterModule.routes, moduleRegister.path);
  }
  
  handleRoute(route: RouteRaw, parentPath?: string) {
    route.voyoFullPath=resolveUrl(parentPath,route.path);
    if (
      !route.component &&
      !route.components &&
      !route.redirect &&
      route.module
    ) {
      if (!route.name) route.name = getUniqueId();
      this.registryModule(route);
    }
    route.children &&
      this.appendRoutes(route.children, route.voyoFullPath);
  }
  appendRoutes(routes: RouteRaw[], parentPath?: string) {
    routes && routes.forEach((route) => this.handleRoute(route, parentPath));
    this.appendChild(routes);
  }

  appendChild(routes: RouteRaw[]) {
    routes.forEach((route) => {
      if(!route.module){
        this.router.addRoute({...route,path:route.voyoFullPath} as any);
      }
    });
  }
}
