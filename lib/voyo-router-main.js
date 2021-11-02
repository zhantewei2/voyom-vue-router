import { __assign, __awaiter, __extends, __generator } from "tslib";
import { VoyoRouterModule } from "./voyo-router-module";
import { resolveUrl } from "./tool";
import { getUniqueId } from "@ztwx/utils";
import { guardShouldLoad } from "./guard";
var VoyoRouterMain = /** @class */ (function (_super) {
    __extends(VoyoRouterMain, _super);
    function VoyoRouterMain(params) {
        var _this = _super.call(this, params) || this;
        _this.moduleRegisters = [];
        return _this;
    }
    VoyoRouterMain.prototype.registryModule = function (route) {
        this.moduleRegisters.push({
            name: route.name,
            module: route.module,
            path: route.voyoFullPath,
            loadComplete: false,
            shouldLoad: route.shouldLoad
        });
    };
    VoyoRouterMain.prototype.mount = function (router) {
        this.router = router;
        this.appendRoutes(this.routes);
        // this.routes.forEach((route) => this.router.addRoute(route as any));
        this.configModuleLoad();
    };
    VoyoRouterMain.prototype.configModuleLoad = function () {
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
                    guardShouldLoad(moduleRegister, to, from, next, function () {
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
                        this.appendRoutes(voyoRouterModule.routes, moduleRegister.path);
                        return [2 /*return*/];
                }
            });
        });
    };
    VoyoRouterMain.prototype.handleRoute = function (route, parentPath) {
        route.voyoFullPath = resolveUrl(parentPath, route.path);
        // is VoyoRouteModuleRaw
        if (!route.component &&
            !route.components &&
            !route.redirect &&
            route.module) {
            // (route as any).component = setting.ChildComponent;
            if (!route.name)
                route.name = getUniqueId();
            this.registryModule(route);
        }
        route.children &&
            this.appendRoutes(route.children, route.voyoFullPath);
    };
    VoyoRouterMain.prototype.appendRoutes = function (routes, parentPath) {
        var _this = this;
        routes && routes.forEach(function (route) { return _this.handleRoute(route, parentPath); });
        this.appendChild(routes);
    };
    VoyoRouterMain.prototype.appendChild = function (routes) {
        var _this = this;
        routes.forEach(function (route) {
            if (!route.module) {
                _this.router.addRoute(__assign(__assign({}, route), { path: route.voyoFullPath }));
            }
        });
    };
    return VoyoRouterMain;
}(VoyoRouterModule));
export { VoyoRouterMain };
//# sourceMappingURL=voyo-router-main.js.map