import { __awaiter, __extends, __generator } from "tslib";
import { VoyoRouterModule } from "./voyo-router-module";
import { setting, resolveUrl } from "./tool";
import { getUniqueId } from "@ztwx/utils";
var VoyoRouterMain = /** @class */ (function (_super) {
    __extends(VoyoRouterMain, _super);
    function VoyoRouterMain(params) {
        var _this = _super.call(this, params) || this;
        _this.moduleRegisters = [];
        return _this;
    }
    VoyoRouterMain.prototype.registryModule = function (route, parentPath) {
        route.voyoFullPath = resolveUrl(parentPath, route.path);
        this.moduleRegisters.push({
            name: route.name,
            module: route.module,
            path: route.voyoFullPath,
            loadComplete: false,
        });
    };
    VoyoRouterMain.prototype.mount = function (router) {
        var _this = this;
        this.router = router;
        this.handleRoutes(this.routes);
        this.routes.forEach(function (route) { return _this.router.addRoute(route); });
        this.handleModuleLoad();
    };
    VoyoRouterMain.prototype.handleModuleLoad = function () {
        var _this = this;
        this.router.beforeEach(function (to, from, next) {
            var moduleRegister;
            var targetPath = to.fullPath;
            var willLoadModule = false;
            for (var _i = 0, _a = _this.moduleRegisters; _i < _a.length; _i++) {
                moduleRegister = _a[_i];
                if (!moduleRegister.loadComplete &&
                    targetPath.startsWith(moduleRegister.path)) {
                    willLoadModule = true;
                    _this.loadModuleStart();
                    _this.loadModule(moduleRegister)
                        .then(function () {
                        moduleRegister.loadComplete = true;
                        _this.loadModuleSuccess(moduleRegister);
                        next(to.fullPath);
                    })
                        .catch(function (e) {
                        console.warn("[Module load error]", e);
                        _this.loadModuleError(e);
                    });
                    break;
                }
            }
            !willLoadModule && next(true);
        });
    };
    VoyoRouterMain.prototype.loadModule = function (moduleRegister) {
        return __awaiter(this, void 0, void 0, function () {
            var module, voyoRouterModule, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        module = moduleRegister.module;
                        if (!(module instanceof Function)) return [3 /*break*/, 2];
                        return [4 /*yield*/, module()];
                    case 1:
                        _a = (_b.sent()).default;
                        return [3 /*break*/, 3];
                    case 2:
                        _a = module;
                        _b.label = 3;
                    case 3:
                        voyoRouterModule = _a;
                        this.handleRoutes(voyoRouterModule.routes, moduleRegister.path);
                        this.appendChild(moduleRegister.name, voyoRouterModule);
                        return [2 /*return*/];
                }
            });
        });
    };
    VoyoRouterMain.prototype.handleRoute = function (route, parentPath) {
        // is VoyoRouteModuleRaw
        if (!route.component &&
            !route.components &&
            !route.redirect &&
            route.module) {
            route.component = setting.ChildComponent;
            if (!route.name)
                route.name = getUniqueId();
            this.registryModule(route, parentPath);
        }
        route.children &&
            this.handleRoutes(route.children, resolveUrl(parentPath, route.path));
    };
    VoyoRouterMain.prototype.handleRoutes = function (routes, parentPath) {
        var _this = this;
        routes && routes.forEach(function (route) { return _this.handleRoute(route, parentPath); });
    };
    VoyoRouterMain.prototype.appendChild = function (moduleName, module) {
        var _this = this;
        module.routes.forEach(function (moduleRoute) {
            _this.router.addRoute(moduleName, moduleRoute);
        });
    };
    return VoyoRouterMain;
}(VoyoRouterModule));
export { VoyoRouterMain };
//# sourceMappingURL=voyo-router-main.js.map