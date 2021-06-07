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

export class VoyoRouterMain extends VoyoRouterModule {
  moduleRegisters: ModuleRegister[] = [];
  constructor(params: RouterModuleParams) {
    super(params);
  }

  registryModule(route: VoyoRouteModuleRaw, parentPath?: string) {
    route.voyoFullPath = resolveUrl(parentPath, route.path);
    this.moduleRegisters.push({
      name: route.name as string,
      module: route.module as any,
      path: route.voyoFullPath,
      loadComplete: false,
    });
  }

  mount(router: VueRouter) {
    this.router = router;
    this.handleRoutes(this.routes);
    this.routes.forEach((route) => this.router.addRoute(route as any));
    this.handleModuleLoad();
  }

  handleModuleLoad() {
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
    this.handleRoutes(voyoRouterModule.routes, moduleRegister.path);
    this.appendChild(moduleRegister.name, voyoRouterModule);
  }
  handleRoute(route: RouteRaw, parentPath?: string) {
    // is VoyoRouteModuleRaw
    if (
      !route.component &&
      !route.components &&
      !route.redirect &&
      route.module
    ) {
      (route as any).component = setting.ChildComponent;
      if (!route.name) route.name = getUniqueId();
      this.registryModule(route, parentPath);
    }
    route.children &&
      this.handleRoutes(route.children, resolveUrl(parentPath, route.path));
  }
  handleRoutes(routes: RouteRaw[], parentPath?: string) {
    routes && routes.forEach((route) => this.handleRoute(route, parentPath));
  }

  appendChild(moduleName: string, module: VoyoRouterModuleImp) {
    module.routes.forEach((moduleRoute) => {
      this.router.addRoute(moduleName, moduleRoute as any);
    });
  }
}
